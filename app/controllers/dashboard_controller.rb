require "pdf-reader"

class DashboardController < ApplicationController
  skip_before_action :authenticate_user! # Allow unauthenticated access to dashboard
  before_action :categories, :dashboard_stats, :get_user
  before_action :get_quizzes_preview, only: [:index]
  skip_before_action :verify_authenticity_token, only: [:file_upload_extract, :delete]


  def index
    @categories = [] if @categories.nil?
    @quiz_preview = [] if @quiz_preview.nil?
    @dashboard_stats = [] if @dashboard_stats.nil?

    render inertia: 'dashboard/Dashboard', props: {
      user: unless @user.nil? then { id: @user.id, email: @user.email, name: @user.name } else nil end,
      categories: @categories,
      dashboard_stats: @dashboard_stats,
      url_params: "/dashboard"
    }
  end


  def update 
    if params[:quiz_ids].present?

      quizzes = Quiz.where(id: params[:quiz_ids])
      topic = params[:topic].strip if params[:topic].present?
      subject = params[:subject].strip if params[:subject].present?
      user_id = params[:user_id] if params[:user_id].present?

      if quizzes.exists?
        quizzes.update_all(topic: topic) if topic.present?
        quizzes.update_all(subject: subject) if subject.present?
        quizzes.update_all(user_id: user_id) if user_id.present?

        render json: {
          updated_subject: subject, 
          updated_topic: topic,
          status: 200
        }, status: 200
      else
        render json: { error: "Quizzes not found" }, status: 404
      end

    end
  end 



  def update_quiz_list 
    if params[:quiz_id].present?
      id = params[:quiz_id]

      quizzes = Quiz.where(id: id)
      quiz_title = params[:quiz_title].strip if params[:quiz_title].present?
      quiz_subject = params[:quiz_subject].strip if params[:quiz_subject].present?

      if quizzes.exists?
        quizzes.update_all(title: quiz_title) if quiz_title.present?
        quizzes.update_all(subject: quiz_subject) if quiz_subject.present?

        render json: {
          updated_subject: quiz_subject, 
          updated_title: quiz_title,
          status: 200
        }, status: 200
      else
        render json: { error: "Quizzes not found" }, status: 404
      end
    end
  end



  def delete
    if params[:quiz_ids].present?
      
      puts "Attempting to delete quiz with ID: #{params[:quiz_ids]}" if Rails.env.development?
      quizzes = Quiz.where(id: params[:quiz_ids])
      quizzes.each do |quiz|
        # Destroy associated quiz_questions and questions if needed
        quiz.quiz_questions.destroy_all if quiz.respond_to?(:quiz_questions)
        quiz.questions.destroy_all if quiz.respond_to?(:questions)
      end

      if quizzes.exists?
        quizzes.destroy_all
        render json: { message: "Quizzes deleted successfully" }
      else
        render json: { error: "Quizzes not found" }, status: 404
      end

    else
      render json: { error: "Missing quiz_ids parameter" }, status: 400
    end
  end



  def delete_single_quiz
    if params[:quiz_id].present?

      single_quiz = Quiz.where(id: params[:quiz_id])

      if single_quiz.exists?
        single_quiz.each do |quiz|
          quiz.quiz_questions.destroy_all if quiz.respond_to?(:quiz_questions)
          quiz.questions.destroy_all if quiz.respond_to?(:questions)
        end

        single_quiz.destroy_all
        render json: { message: "Quiz deleted successfully" }
      else
        render json: { error: "Quiz not found" }, status: 404
      end
    else
      render json: { error: "Missing quiz_id parameter" }, status: 400
    end
  end



  def get_all_quizzes_from_subject
    if params[:subject].present?
      puts "Fetching all quizzes for subject: #{params[:subject]}" if Rails.env.development?
      subject_name = params[:subject]

      quizzes = Quiz.where(subject: subject_name).includes(:questions)

      quiz_details = quizzes.map do |quiz|
        {
          id: quiz.id,
          title: quiz.title,
          description: quiz.description,
          external_ids: quiz.questions.pluck(:external_id)
        }
      end

      render json: { 
        subject: subject_name,
        total_quizzes: quizzes.count,
        quiz_details: quiz_details 
      }
    else
      render json: { error: "Missing subject parameter" }, status: 400
    end
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
      # created_quiz = create_quiz(params[:quiz])
      created_quiz = Quiz.create!(params[:quiz])
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
            # image: get_pic_from_unsplash(quiz.subject)
            image: UnsplashService.get_image(quiz.subject)
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

      puts "Extracted text length: #{file_text.length} characters" if Rails.env.development?
      uploaded_original_file_name = uploaded_file.original_filename
      
      # Generate quiz with optional parameters
      quiz_data = OpenaiService.generate_quiz_from_uploaded_file(
        @categories,
        file_text, 
        uploaded_original_file_name, 
        title, 
        topic, 
        subject
      )

      note = nil
      saved_quiz = nil

      if quiz_data.present?
        # 1. Create note for all users (authenticated and unauthenticated) with PDF attached
        note = Note.new(
          title: title || "Note from #{uploaded_original_file_name}",
          content: file_text,
          pdf_images: extract_pdf_images(uploaded_file),
          user: @user # Will be nil for unauthenticated users, which is fine
        )
        
        # 2. Attach the PDF file before saving to pass validation
        note.pdf_file.attach(uploaded_file)
        note.save!
        
        puts "Successfully created note: #{note.title}" if Rails.env.development?
        puts "Note created for user: #{@user&.email || 'anonymous'}" if Rails.env.development?
        
        # 3. Create quiz and associate with the note
        saved_quiz = QuizCreationService.call(quiz_data, @user, note)
        
        if saved_quiz
          puts "Successfully saved quiz: #{saved_quiz.title}" if Rails.env.development?
          puts "Associated with note: #{note.title}" if Rails.env.development? && note.present?
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
        note_created: note.present?,
        quiz_generated: quiz_data.present?,
        quiz_saved: saved_quiz.present?
      }
      
    rescue => e
      Rails.logger.error "Error processing file upload: #{e.message}"
      render json: { 
        error: "Failed to process uploaded file: #{e.message}" 
      }, status: :internal_server_error
    end
  end



  private

  def get_subjects_for_topic(topic)
    Quiz.where(topic: topic).distinct.pluck(:subject)
  end

  def get_user 
    if user_signed_in?
      @user = current_user
    else
      @user = nil
    end 
  end

  def check_score
  end

  def dashboard_stats
    if user_signed_in?
      @dashboard_stats = {
        total_quizzes: Quiz.where(user_id: current_user.id).count,
        total_questions: Question.joins(:quiz_questions).where(quiz_questions: { quiz_id: Quiz.where(user_id: current_user.id).select(:id) }).count,
        total_topics: Quiz.where(user_id: current_user.id).distinct.count(:topic),
        total_subjects: Quiz.where(user_id: current_user.id).distinct.count(:subject)
      }
    else
      @dashboard_stats = {
        total_quizzes: Quiz.public_quizzes.count,
        total_questions: Question.joins(:quiz_questions).where(quiz_questions: { quiz_id: Quiz.public_quizzes.select(:id) }).count,
        total_topics: Quiz.public_quizzes.distinct.count(:topic),
        total_subjects: Quiz.public_quizzes.distinct.count(:subject)
      }
    end
  end


  # def create_quiz(quiz_params)
  #   created_q = Quiz.create!(quiz_params)
  #   return created_q
  # end

  def categories
    if user_signed_in?
      @categories = Quiz.where(user_id: current_user.id).distinct.order(:topic).pluck(:topic).map { |topic| { topic: topic } }
    else
      @categories = Quiz.public_quizzes.distinct.order(:topic).pluck(:topic).map { |topic| { topic: topic } }
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

  def extract_pdf_images(uploaded_file)
    return {} unless uploaded_file.content_type == 'application/pdf'
    
    begin
      # Extract basic PDF metadata for now
      # Future enhancement: Use mini_magick to extract actual images
      reader = PDF::Reader.new(uploaded_file.tempfile)
      
      {
        total_pages: reader.page_count,
        extracted_at: Time.current,
        file_size: uploaded_file.size,
        original_filename: uploaded_file.original_filename,
        content_type: uploaded_file.content_type
      }
    rescue => e
      Rails.logger.error "PDF metadata extraction failed: #{e.message}"
      {
        error: e.message,
        extracted_at: Time.current,
        file_size: uploaded_file.size,
        original_filename: uploaded_file.original_filename
      }
    end
  end
  

  def get_topic_quizzes_preview(topic)
    quizzes = if user_signed_in?
      current_user.quizzes.includes(:questions, :note).where(topic: topic)
    else
      Quiz.public_quizzes.includes(:questions, :note).where(topic: topic)
    end
    # Group quizzes by subject
    subjects = quizzes.group_by(&:subject).map do |subject, subject_quizzes|
      quiz_details = subject_quizzes.map do |quiz|
        quiz_data = {
          id: quiz.id,
          title: quiz.title,
          description: quiz.description,
          external_ids: quiz.questions.pluck(:external_id)
        }
        
        # Add note information if quiz has an associated note
        if quiz.note.present?
          quiz_data[:note] = {
            id: quiz.note.id,
            title: quiz.note.title,
            has_pdf: quiz.note.pdf_file.attached?,
            created_at: quiz.note.created_at
          }
        end
        
        quiz_data
      end
      {
        subject: subject,
        topic: topic,
        quiz_details: quiz_details,
        img: UnsplashService.get_image(subject),
      }
    end
    subjects
  rescue => e
    Rails.logger.error "Error loading quiz preview: #{e.message}"
    []
  end


  def get_quizzes_preview
    user_quizzes = if user_signed_in?
      current_user.quizzes.includes(:questions, :note)
    else
      Quiz.public_quizzes.includes(:questions, :note)  # Show quizzes without users for non-logged in users
    end

    @quiz_preview = user_quizzes.group_by(&:topic).map do |topic, topic_quizzes|
      subjects = topic_quizzes.group_by(&:subject).map do |subject, subject_quizzes|
        quiz_external_ids = subject_quizzes.map do |quiz|
          quiz_data = {
            title: quiz.title,
            external_ids: quiz.questions.pluck(:external_id)
          }
          
          # Add note information if available
          if quiz.note.present?
            quiz_data[:note] = {
              id: quiz.note.id,
              title: quiz.note.title,
              has_pdf: quiz.note.pdf_file.attached?
            }
          end
          
          quiz_data
        end
        {
          ids: subject_quizzes.map(&:id),
          topic: topic,
          subject: subject,
          titles: subject_quizzes.map(&:title),
          description: topic_quizzes.map(&:description),
          quiz_details: quiz_external_ids,
          img: UnsplashService.get_image(subject),
        }
      end
      subjects
    end.flatten 
  rescue => e
    Rails.logger.error "Error loading quiz preview: #{e.message}"
    @quiz_preview = []
  end


end
