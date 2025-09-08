require "pdf-reader"

class DashboardController < ApplicationController
  skip_before_action :authenticate_user! # Allow unauthenticated access to dashboard
  before_action :categories, :dashboard_stats
  before_action :get_quizzes_preview, only: [:index]
  skip_before_action :verify_authenticity_token, only: [:file_upload_extract]

  def index
    @categories = [] if @categories.nil?
    @quiz_preview = [] if @quiz_preview.nil?
    @dashboard_stats = [] if @dashboard_stats.nil?

    puts "Dashboard stats: #{@dashboard_stats.inspect}" if Rails.env.development?

    render inertia: 'dashboard/Dashboard', props: { 
      categories: @categories,
      dashboard_stats: @dashboard_stats,
      url_params: "/dashboard"
    }
  end

  def get_topic_quizzes
    if params[:topic].present?
      puts "Fetching quizzes for topic: #{params[:topic]}" if Rails.env.development?
      topic_name = params[:topic]

      subjects = get_subjects_for_topic(topic_name)
      quiz_preview = get_topic_quizzes_preview(topic_name)

      render json: { subjects: subjects, quiz_preview: quiz_preview }
    else
      render json: { error: "Missing topic parameter" }, status: 400
    end
  end

  def page_refresh
    if params[:topic].present?
      puts "Page refresh for topic: #{params[:topic]}" if Rails.env.development?
      puts "Current categories: #{@categories.inspect}" if Rails.env.development?
      puts "Current dashboard stats: #{@dashboard_stats.inspect}" if Rails.env.development?

      render inertia: 'dashboard/Dashboard', props: { 
        categories: @categories,
        dashboard_stats: @dashboard_stats,
        url_params: params[:topic],
      }
    else
      render json: { error: "Missing topic parameter" }, status: 400
    end
  end


  def create
    if params[:quiz].present?
      created_quiz = create_quiz(params[:quiz])
      render json: { message: "Quiz created successfully", quiz: created_quiz.to_json }
    end
  end


  def show
    if params[:topic].present?

    quiz_conditions = { topic: params[:topic] }
    quiz_conditions[:subject] = params[:subject] if params[:subject].present?
        
    if params[:quiz_ids].present?
      quiz_ids = params[:quiz_ids].is_a?(Array) ? params[:quiz_ids] : [params[:quiz_ids]]
      quiz_conditions[:id] = quiz_ids
    end

    filtered_quizzes = Quiz.includes(:questions).where(quiz_conditions)
    
    questions_only = []
    filtered_quizzes.each do |quiz|
      quiz.questions.each do |question|
        questions_only << {
            id: question.external_id,
            type: question.question_format,
            question: question.question,
            answer: question.answer,
            incorrect_answers: question.incorrect_answers,
            hint: question.hint,
            explanation: question.explanation,
            difficulty: question.difficulty,
            estimated_time_seconds: question.estimated_time_seconds,
            tags: question.tags,
            path: question.path,
            quiz_title: quiz.title,
            subject: quiz.subject,
            image: get_pic_from_unsplash(quiz.subject)
          }
        end
      end
      
      render json: { 
        topic: params[:topic], 
        total_questions: questions_only.length,
        questions: questions_only 
      }

    else
      render json: { error: "Missing topic parameter" }, status: 400
    end
  end

  

  def file_upload_extract
    # Safely extract and validate parameters
    uploaded_file = params[:file]
    title = params[:title]&.strip&.presence
    topic = params[:topic]&.strip&.presence
    subject = params[:subject]&.strip&.presence

    # Validate required file parameter
    unless uploaded_file.present?
      render json: { error: "No file uploaded" }, status: :unprocessable_entity
      return
    end

    # Validate file type
    unless ['application/pdf', 'text/plain'].include?(uploaded_file.content_type)
      render json: { 
        error: "Invalid file type. Only PDF and TXT files are supported." 
      }, status: :unprocessable_entity
      return
    end

    # Validate file size (e.g., max 10MB)
    max_size = 10.megabytes
    if uploaded_file.size > max_size
      render json: { 
        error: "File too large. Maximum size is #{max_size / 1.megabyte}MB." 
      }, status: :unprocessable_entity
      return
    end

    begin
      file_text = extract_text(uploaded_file)
      
      # Generate quiz with optional parameters
      quiz_data = generate_quiz_from_uploaded_file(
        file_text, 
        uploaded_file.original_filename, 
        title, 
        topic, 
        subject
      )

      if quiz_data.present?
        saved_quiz = save_quiz_to_database(quiz_data)
        if saved_quiz
          puts "Successfully saved quiz: #{saved_quiz.title}" if Rails.env.development?
        else
          Rails.logger.error "Failed to save quiz to database"
        end
      else
        Rails.logger.error "Failed to generate quiz data from file"
      end
      
      render json: { 
        message: "File uploaded and processed successfully", 
        filename: uploaded_file.original_filename,
        content_type: uploaded_file.content_type,
        quiz_generated: quiz_data.present?,
        quiz_saved: quiz_data.present? && saved_quiz.present?
      }
      
    rescue => e
      Rails.logger.error "Error processing file upload: #{e.message}"
      render json: { 
        error: "Failed to process uploaded file: #{e.message}" 
      }, status: :internal_server_error
    end
  end



  private

  def check_score
  end

  def dashboard_stats
    @dashboard_stats = { 
      total_quizzes: Quiz.count,
      total_questions: Question.count,
      total_topics: Quiz.distinct.count(:topic),
      total_subjects: Quiz.distinct.count
    }
  end

  def render_quiz_data
    if params[:topic].present?

    quiz_conditions = { topic: params[:topic] }
    quiz_conditions[:subject] = params[:subject] if params[:subject].present?
        
    if params[:quiz_ids].present?
      quiz_ids = params[:quiz_ids].is_a?(Array) ? params[:quiz_ids] : [params[:quiz_ids]]
      quiz_conditions[:id] = quiz_ids
    end

    filtered_quizzes = Quiz.includes(:questions).where(quiz_conditions)
    
    questions_only = []
    filtered_quizzes.each do |quiz|
      quiz.questions.each do |question|
        questions_only << {
            id: question.external_id,
            type: question.question_format,
            question: question.question,
            answer: question.answer,
            incorrect_answers: question.incorrect_answers,
            hint: question.hint,
            explanation: question.explanation,
            difficulty: question.difficulty,
            estimated_time_seconds: question.estimated_time_seconds,
            tags: question.tags,
            path: question.path,
            quiz_title: quiz.title,
            subject: quiz.subject,
            image: get_pic_from_unsplash(quiz.subject)
          }
        end
      end
      
      render json: { 
        topic: params[:topic], 
        total_questions: questions_only.length,
        questions: questions_only 
      }

    else
      render json: { error: "Missing topic parameter" }, status: 400
    end
  end


  def save_quiz_to_database(quiz_data)
    return nil unless quiz_data.present?

      begin
        # Create the Quiz record
        quiz = Quiz.create!(
          topic: quiz_data['topic'],
          subject: quiz_data['subject'], 
          title: quiz_data['title'],
          description: quiz_data['description']
        )

        # Create Question records and associate them with the quiz
        quiz_data['questions'].each do |question_data|
          question = Question.create!(
            external_id: question_data['external_id'],
            question_format: question_data['question_format'],
            question: question_data['question'],
            answer: question_data['answer'],
            incorrect_answers: question_data['incorrect_answers'],
            hint: question_data['hint'],
            explanation: question_data['explanation'],
            difficulty: question_data['difficulty'],
            estimated_time_seconds: question_data['estimated_time_seconds'],
            tags: question_data['tags'],
            path: question_data['path']
          )

          # Create the join table relationship
          QuizQuestion.create!(
            quiz: quiz,
            question: question
          )
        end

        return quiz
      rescue => e
        Rails.logger.error "Error saving quiz to database: #{e.message}"
        return nil
    end
  end


  def create_quiz(quiz_params)
    # Create a new quiz record
    created_q = Quiz.create!(quiz_params)
    return created_q
  end

  def generate_quiz_from_uploaded_file(file_text, filename, title, topic, subject)
    system_prompt = <<~PROMPT
      You are an expert quiz generator. Generate quiz questions based on the provided text content. Return ONLY valid JSON in the exact format specified, with no additional text or explanations.
    PROMPT

    prompt = build_quiz_prompt(file_text, filename, title, topic, subject)

    # Get API key from Rails credentials or environment variable
    api_key = Rails.application.credentials.openai_api_key || ENV['OPENAI_API_KEY'] || ENV['OPENAI_ACCESS_TOKEN']
    
    unless api_key.present?
      Rails.logger.error "OpenAI API key not found"
      return nil
    end

    quiz_data = OpenAI::Client.new(access_token: api_key).chat(
      parameters: {
        model: "gpt-4o",
        messages: [
          { 
            role: "system", 
            content: system_prompt
          },
          { 
            role: "user", 
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: "json_object" }
      }
    ).dig("choices", 0, "message", "content")

    if quiz_data.present?
      # Clean any potential markdown formatting
      cleaned_data = quiz_data.strip
                            .gsub(/^```json\s*/, '')
                            .gsub(/^```\s*/, '')
                            .gsub(/\s*```$/, '')
                            .strip
      
      print("Generated quiz JSON: #{cleaned_data}") if Rails.env.development?
      return JSON.parse(cleaned_data)
    end
  end



  def build_quiz_prompt(file_text, filename, title, topic, subject)
    puts "Building quiz prompt...", title, topic, subject
    # Truncate content if too long
    truncated_text = file_text.length > 8000 ? file_text[0..8000] + "..." : file_text

    # Build conditional instructions based on provided parameters
    title_instruction = title.present? ? "- Use '#{title}' as the quiz title" : "- Generate an appropriate quiz title based on content"
    topic_instruction = topic.present? ? "- Use '#{topic}' as the quiz topic" : "- If quiz is related to an existing topic (#{@categories&.map { |c| c[:topic] }&.join(', ')}), use that topic (case insensitive)"
    subject_instruction = subject.present? ? "- Use '#{subject}' as the quiz subject" : "- Generate an appropriate subject based on content"

    json_quiz_example = {
        "topic": "[Main topic/category from the content]",
        "subject": "[Specific subject area]",
        "title": "[Descriptive quiz title]",
        "description": "[Brief description of what this quiz covers]",
        "questions": [
          {
            "external_id": "[topic_subject_uniqueID_001]",
            "question_format": "multiple_choice",
            "question": "[Your question text here]",
            "answer": "[Correct answer]",
            "incorrect_answers": [
              "Wrong option 1",
              "Wrong option 2",
              "Wrong option 3"
            ],
            "code_snippet": "[Optional code snippet related to the question]",
            "hint": "[Optional helpful hint]",
            "explanation": "[Explanation of why this answer is correct]",
            "difficulty": "[easy|intermediate|advanced]",
            "estimated_time_seconds": [30, 120],
            "tags": ["tag1", "tag2", "tag3"],
            "path": "[topic/subject/category]"
          }
        ]
    }
    
    "Based on the following text content from file '#{filename}', generate quiz questions in this EXACT JSON format: #{json_quiz_example.to_json}

    Requirements:
    - Generate 10-20 challenging questions that deeply cover the content, designed to promote true understanding and retention.
    - Include a mix of multiple choice and long response questions.
    - Ensure topic names are concise (2 words preferred, maximum 3 words).
    - Each multiple choice question must have exactly 3 plausible but incorrect distractors.
    - Each long response question must provide:
        1. A structured guideline for how to approach the answer
        2. A clear, accurate solution
    - Use meaningful `external_id` values like: quiz_subject_001, quiz_subject_002, etc.
    - Assign difficulty levels: mostly advanced, with a few intermediate questions for variety.
    - Include relevant tags describing the topic of each question.
    - Set realistic time estimates per question (30–120 seconds).
    - Provide clear explanations for **why the correct answer is correct**.
    - Ensure questions evaluate multiple cognitive skills: comprehension, application, analysis, and synthesis.
    - Include optional code snippets or examples when relevant; format them clearly for readability.
    - Make questions thought-provoking, avoiding surface-level recall.

    #{title_instruction}
    #{topic_instruction}
    #{subject_instruction}

    Text content to analyze:
    #{truncated_text}"
  end

  # def categories
  #   @categories = Quiz.distinct.order(:topic).pluck(:topic).map do |topic|
  #     # Get the first description for this topic
  #     desc = Quiz.where(topic: topic).pluck(:description).first
  #     { topic: topic, description: desc }
  #   end
  #   puts "Setting Categories: #{@categories.inspect}" if Rails.env.development?
  # rescue => e
  #   Rails.logger.error "Error loading categories: #{e.message}"
  #   @categories = []
  # end

  def categories
    @categories = Quiz.distinct.order(:topic).pluck(:topic).map do |topic|
      { topic: topic }
    end
  rescue => e
    Rails.logger.error "Error loading categories: #{e.message}"
    @categories = []
  end


  def extract_text(file)
    if file.content_type == "application/pdf"
      reader = PDF::Reader.new(file.tempfile)
      reader.pages.map(&:text).join("\n")
    else # .txt file
      file.read
    end
  end

  def get_topic_quizzes_preview(topic)
    # Fetch quizzes for the given topic, including their questions
    # Filter by user if signed in, otherwise show public quizzes
    quizzes = if user_signed_in?
      current_user.quizzes.includes(:questions).where(topic: topic)
    else
      Quiz.public_quizzes.includes(:questions).where(topic: topic)
    end

    # Group quizzes by subject
    subjects = quizzes.group_by(&:subject).map do |subject, subject_quizzes|
      # For each quiz, map its title and external_ids of its questions
      quiz_details = subject_quizzes.map do |quiz|
        {
          id: quiz.id,
          title: quiz.title,
          description: quiz.description,
          external_ids: quiz.questions.pluck(:external_id)
        }
      end

      {
        subject: subject,
        topic: topic,
        quiz_details: quiz_details,
        img: get_pic_from_unsplash(subject)
      }
    end
    subjects
  rescue => e
    Rails.logger.error "Error loading quiz preview: #{e.message}"
    []
  end


  def get_quizzes_preview
    # Get quizzes for current user only
    user_quizzes = if user_signed_in?
      current_user.quizzes.includes(:questions)
    else
      Quiz.public_quizzes.includes(:questions)  # Show quizzes without users for non-logged in users
    end

    @quiz_preview = user_quizzes.group_by(&:topic).map do |topic, topic_quizzes|
      subjects = topic_quizzes.group_by(&:subject).map do |subject, subject_quizzes|
        # mapping each quiz title to its external_ids
        quiz_external_ids = subject_quizzes.map do |quiz|
          {
            title: quiz.title,
            external_ids: quiz.questions.pluck(:external_id)
          }
        end
        {
          ids: subject_quizzes.map(&:id),
          topic: topic,
          subject: subject,
          titles: subject_quizzes.map(&:title),
          description: topic_quizzes.map(&:description),
          quiz_details: quiz_external_ids,
          img: get_pic_from_unsplash(subject),
        }
      end
      subjects
    end.flatten 
  rescue => e
    Rails.logger.error "Error loading quiz preview: #{e.message}"
    @quiz_preview = []
  end


  def quiz_preview_img 
    if params[:subject].present?
      image_url = get_pic_from_unsplash(params[:subject])
      render json: { subject: params[:subject], image_url: image_url }
    else
      render json: { error: "Missing subject parameter" }, status: 400
    end
  end

  def get_subjects_for_topic(topic)
    Quiz.where(topic: topic).distinct.pluck(:subject)
  end


  def get_pic_from_unsplash(subject)
    require 'net/http'
    require 'uri'
    require 'json'

    client_id = Rails.application.credentials.unsplash_access_key || ENV['UNSPLASH_ACCESS_KEY']    
    return nil unless client_id

    begin
      uri = URI("https://api.unsplash.com/search/photos")
      uri.query = URI.encode_www_form({
        page: 1,
        query: subject,
        per_page: 1
      })

      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true

      request = Net::HTTP::Get.new(uri)
      request['Content-Type'] = 'application/json'
      request['Accept'] = 'application/json'
      request['Accept-Version'] = 'v1'
      request['Authorization'] = "Client-ID #{client_id}"
      response = http.request(request)

      if response.code == '200'
        data = JSON.parse(response.body)
        return data.dig('results', 0, 'urls', 'small')
      else
        Rails.logger.error "Unsplash API error: #{response.code} - #{response.body}"
        return nil
      end

    rescue => e
      Rails.logger.error "Error fetching image from Unsplash: #{e.message}"
      return nil
    end
  end

end
