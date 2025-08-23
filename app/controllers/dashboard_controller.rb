require "pdf-reader"

class DashboardController < ApplicationController
  before_action :categories
  before_action :get_quizzes_preview, only: [:index]
  skip_before_action :verify_authenticity_token, only: [:file_upload_extract]

  def index
    @categories = [] if @categories.nil?
    @quiz_preview = [] if @quiz_preview.nil?
    
    render inertia: 'dashboard/Dashboard', props: { 
      categories: @categories, 
      quiz_preview: @quiz_preview 
    }
  end


  def create
    if params[:quiz].present?
      created_quiz = create_quiz(params[:quiz])
      render json: { message: "Quiz created successfully", quiz: created_quiz.to_json }
    end
  end


  def show
    if params[:topic].present?
      topic_quizzes = Quiz.includes(:questions).where(topic: params[:topic])

      # Flatten all questions from all quizzes, including quiz context
      questions_only = []
      topic_quizzes.each do |quiz|
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
    uploaded_file = params[:file]

    unless uploaded_file
      render json: { error: "No file uploaded" }, status: :unprocessable_entity
      return
    end

    file_text = extract_text(uploaded_file)
    quiz_data = generate_quiz_from_uploaded_file(file_text, uploaded_file.original_filename)

    if quiz_data
      save_quiz_to_database(quiz_data)
    end

    puts "Extracted text: #{file_text}" if Rails.env.development?
    puts "quiz_data: #{quiz_data}" if Rails.env.development?
    
    render json: { 
      message: "File uploaded successfully", 
      text: file_text,
      filename: uploaded_file.original_filename,
      content_type: uploaded_file.content_type
    }
  end



  def check_score

  end


  private


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

  def generate_quiz_from_uploaded_file(file_text, filename)
    system_prompt = <<~PROMPT
      You are an expert quiz generator. Generate quiz questions based on the provided text content. Return ONLY valid JSON in the exact format specified, with no additional text or explanations.
    PROMPT

    prompt = build_quiz_prompt(file_text, filename)

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
        max_tokens: 2000
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



  def build_quiz_prompt(file_text, filename)
     # Truncate content if too long
    truncated_text = file_text.length > 8000 ? file_text[0..8000] + "..." : file_text

    json_quiz_example = {
        "topic": "[Main topic/category from the content]",
        "subject": "[Specific subject area]",
        "title": "[Descriptive quiz title]",
        "description": "[Brief description of what this quiz covers]",
        "questions": [
          {
            "external_id": "[unique_id_001]",
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
    - Generate 5-15 questions based on content complexity
    - If any quiz is related to an existing topic (#{@categories} act as topics for each quiz), use that topic for the quiz topic
    - create a mix of multiple choice or long response questions
    - Each mutiple choice question must have exactly 3 incorrect answers
    - Each long response should provide 1 option providing contentext / structure on how to answer the question
    - Each long response should also provide a clear answer to the question
    - Use meaningful external_id format like: quiz_subject_001, etc.
    - Set appropriate difficulty levels to intermediate but throw in some advanced questions
    - Include relevant tags that describe the question topic
    - Set realistic time estimates (30-120 seconds per question)
    - Provide clear explanations for each correct answer
    - Ensure questions test different aspects: comprehension, application, analysis
    - Provide optional code snippets for the question for more context, format the code snippets as needed

    Text content to analyze:
    #{truncated_text}"
  end

  def categories
    @categories = Quiz.distinct.pluck(:topic).map do |topic|
      # Get the first description for this topic
      desc = Quiz.where(topic: topic).pluck(:description).first
      { topic: topic, description: desc }
    end
    puts "Setting Categories: #{@categories.inspect}" if Rails.env.development?
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


  def get_quizzes_preview
    # Group quizzes by topic and subject, then collect titles for each subject
    @quiz_preview = Quiz.all.group_by(&:topic).map do |topic, topic_quizzes|
      subjects = topic_quizzes.group_by(&:subject).map do |subject, subject_quizzes|
         puts "Setting Quiz topic_quizzes: #{topic_quizzes.inspect}" if Rails.env.development?
         puts "Setting Quiz topic: #{topic.inspect}" if Rails.env.development?
        {
          topic: topic,
          subject: subject,
          titles: subject_quizzes.map(&:title),
          description: topic_quizzes.map(&:description),
          # difficulty: Quiz.where(topic: topic).questions.map(&:difficulty),
          # tags: topic_quizzes.map(&:tags),
          img: get_pic_from_unsplash(subject),
        }
      end
      subjects
    end.flatten
    
    # puts "Setting Quiz Preview: #{@quiz_preview.inspect}" if Rails.env.development?
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
