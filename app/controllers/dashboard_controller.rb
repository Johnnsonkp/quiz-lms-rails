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

  # API endpoint for heatmap data
  def study_activity
    if @user.nil?
      render json: { error: "User not authenticated" }, status: 401
      return
    end

    activity_type = params[:type] || 'quiz' # 'quiz' or 'question'
    start_date = params[:start_date] ? Date.parse(params[:start_date]) : 365.days.ago
    end_date = params[:end_date] ? Date.parse(params[:end_date]) : Date.current

    case activity_type
    when 'quiz'
      activity_data = @user.daily_quiz_activity(start_date: start_date, end_date: end_date)
    when 'question'
      activity_data = @user.daily_question_activity(start_date: start_date, end_date: end_date)
    else
      # Combined activity (quizzes + questions)
      quiz_data = @user.daily_quiz_activity(start_date: start_date, end_date: end_date)
      question_data = @user.daily_question_activity(start_date: start_date, end_date: end_date)
      
      # Merge the data by date
      activity_data = merge_activity_data(quiz_data, question_data)
    end


    # puts "Activity data for user #{@user.id} from #{start_date} to #{end_date}: #{activity_data}" if Rails.env.development?
    puts "Summary: completed_quizzes_count - #{@user.completed_quizzes_count}, attempted_quizzes_count - #{@user.attempted_quizzes_count}" if Rails.env.development?
    puts "Date range: #{start_date} to #{end_date}" if Rails.env.development?
    puts "Timezone: Australia/Sydney (AEST)" if Rails.env.development?
    puts "Current time (AEST): #{Time.current.in_time_zone('Australia/Sydney')}" if Rails.env.development?

    # Calculate summary data for the same date range as activity data (AEST timezone)
    aest_start = start_date.in_time_zone('Australia/Sydney').beginning_of_day
    aest_end = end_date.in_time_zone('Australia/Sydney').end_of_day
    
    date_range_completed = @user.user_quiz_progresses
      .where(completed: true)
      .where(created_at: aest_start..aest_end)
      .count
    
    date_range_attempted = @user.user_quiz_progresses
      .where(created_at: aest_start..aest_end)
      .count

    puts "Date range completed: #{date_range_completed}, attempted: #{date_range_attempted}" if Rails.env.development?
    puts "Recent progresses (AEST): #{@user.user_quiz_progresses.where('created_at > ?', 1.day.ago).pluck(:created_at).map { |t| t.in_time_zone('Australia/Sydney') }}" if Rails.env.development?

    render json: {
      activity_data: activity_data,
      summary: {
        total_completed: date_range_completed,
        total_attempted: date_range_attempted,
        all_time_completed: @user.completed_quizzes_count,
        all_time_attempted: @user.attempted_quizzes_count,
        date_range: {
          start: start_date.iso8601,
          end: end_date.iso8601
        }
      }
    }
  rescue Date::Error
    render json: { error: "Invalid date format" }, status: 400
  end

  # Study Hours endpoints moved here for better autoloading
  def create_study_hours
    if @user.nil?
      render json: { error: "User not authenticated" }, status: 401
      return
    end

    study_hour_params = params.require(:study_hour).permit(:date, :hours)
    
    begin
      # Find existing record or create new one
      study_hour = @user.study_hours.find_or_initialize_by(date: study_hour_params[:date])
      
      if study_hour.persisted?
        # Update existing record
        study_hour.hours = study_hour_params[:hours]
        action = "updated"
      else
        # Create new record
        study_hour.hours = study_hour_params[:hours]
        action = "created"
      end

      if study_hour.save
        render json: {
          message: "Study hours #{action} successfully",
          study_hour: {
            id: study_hour.id,
            date: study_hour.date,
            hours: study_hour.hours.to_f,
            action: action
          }
        }, status: 200
      else
        render json: {
          error: "Failed to save study hours",
          details: study_hour.errors.full_messages
        }, status: 422
      end
    rescue => e
      Rails.logger.error "Error saving study hours: #{e.message}"
      render json: { error: "Failed to save study hours: #{e.message}" }, status: 500
    end
  end

  def study_hours_data
    puts "=== STUDY HOURS DATA ENDPOINT CALLED ===" if Rails.env.development?
    
    if @user.nil?
      render json: { error: "User not authenticated" }, status: 401
      return
    end

    begin
      start_date = params[:start_date] ? Date.parse(params[:start_date]) : 6.months.ago.to_date
      end_date = params[:end_date] ? Date.parse(params[:end_date]) : Date.current

      activity_data = StudyHour.daily_study_activity(@user, start_date, end_date)
      summary = StudyHour.study_summary(@user, start_date, end_date)

      render json: {
        activity_data: activity_data,
        summary: summary
      }
    rescue => e
      Rails.logger.error "Error fetching study hours data: #{e.message}"
      render json: { error: "Failed to load study hours data" }, status: 500
    end
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


  
  def edit_quiz_question_by_id
    if params[:question_id].present?
      question = Question.find_by(external_id: params[:question_id])

      if question
        question.question = params[:question] if params[:question].present?
        question.answer = params[:answer] if params[:answer].present?
        question.incorrect_answers = params[:incorrect_answers] if params[:incorrect_answers].present?

        if question.save
          render json: { message: "Question updated successfully", question: question }, status: 200
        else
          render json: { error: "Failed to update question", details: question.errors.full_messages }, status: 422
        end
      else
        render json: { error: "Question not found" }, status: 404
      end
    else
      render json: { error: "Missing question_id parameter" }, status: 400
    end
  end

  def complete_quiz
    puts "=== COMPLETE QUIZ ENDPOINT CALLED ===" if Rails.env.development?
    
    if @user.nil?
      puts "ERROR: User not authenticated" if Rails.env.development?
      render json: { error: "User not authenticated" }, status: 401
      return
    end

    quiz_id = params[:quiz_id]
    puts "Quiz ID received: #{quiz_id}" if Rails.env.development?
    
    quiz = Quiz.find_by(id: quiz_id)

    unless quiz
      puts "ERROR: Quiz not found with ID: #{quiz_id}" if Rails.env.development?
      render json: { error: "Quiz not found" }, status: 404
      return
    end

    puts "Quiz found: #{quiz.title}" if Rails.env.development?

    # Calculate quiz statistics
    answers = params[:answers] || {}
    puts "Answers received: #{answers}" if Rails.env.development?
    
    total_questions = quiz.questions.count
    questions_answered = answers.keys.count
    questions_correct = 0
    total_points = 0

    puts "Total questions in quiz: #{total_questions}" if Rails.env.development?
    puts "Questions answered: #{questions_answered}" if Rails.env.development?

    # Calculate correct answers
    quiz.questions.each do |question|
      puts "question ID: #{question.id}, external_id: #{question.external_id}" if Rails.env.development?
      puts "answers hash: #{answers}" if Rails.env.development?

      user_answer = answers[question.external_id.to_s]
      puts "user_answer for question #{question.external_id}: #{user_answer}" if Rails.env.development?
      puts "correct_answer: #{question.answer}" if Rails.env.development?
      
      if user_answer && user_answer == question.answer
        questions_correct += 1
        total_points += 1 # You can adjust point values as needed
        puts "Question #{question.id} answered correctly!" if Rails.env.development?
      end
    end

    # Create new UserQuizProgress record for each completion
    puts "=== CREATING NEW USER QUIZ PROGRESS ===" if Rails.env.development?
    puts "Creating new progress record for user #{@user.id} and quiz #{quiz.id}" if Rails.env.development?
    
    # Always create a new record for each quiz completion
    progress = UserQuizProgress.new(
      user: @user,
      quiz: quiz,
      questions_answered: questions_answered,
      questions_correct: questions_correct,
      total_points: total_points,
      completed: true
    )

    puts "New progress record: #{progress.inspect}" if Rails.env.development?

    puts "About to save new progress with attributes:" if Rails.env.development?
    puts "  questions_answered: #{questions_answered}" if Rails.env.development?
    puts "  questions_correct: #{questions_correct}" if Rails.env.development?
    puts "  total_points: #{total_points}" if Rails.env.development?
    puts "  completed: true" if Rails.env.development?
    
    # Check current totals before save
    current_completed = @user.user_quiz_progresses.where(completed: true).count
    current_attempted = @user.user_quiz_progresses.count
    puts "BEFORE SAVE - User totals: completed=#{current_completed}, attempted=#{current_attempted}" if Rails.env.development?

    puts "=== Quiz Completion Debug ===" if Rails.env.development?
    puts "User: #{@user.id}, Quiz: #{quiz_id}" if Rails.env.development?
    puts "Total questions: #{total_questions}" if Rails.env.development?
    puts "Questions answered: #{questions_answered}" if Rails.env.development?
    puts "Questions correct: #{questions_correct}" if Rails.env.development?

    if progress.save
      puts "✅ Progress saved successfully! ID: #{progress.id}" if Rails.env.development?
      puts "Progress created_at: #{progress.created_at}" if Rails.env.development?
      puts "Progress timezone (AEST): #{progress.created_at.in_time_zone('Australia/Sydney')}" if Rails.env.development?
      puts "Current time (AEST): #{Time.current.in_time_zone('Australia/Sydney')}" if Rails.env.development?
      puts "Application timezone: #{Time.zone.name}" if Rails.env.development?
      
      # Check totals after save
      new_completed = @user.user_quiz_progresses.where(completed: true).count
      new_attempted = @user.user_quiz_progresses.count
      puts "AFTER SAVE - User totals: completed=#{new_completed}, attempted=#{new_attempted}" if Rails.env.development?
      puts "Change in totals: completed +#{new_completed - current_completed}, attempted +#{new_attempted - current_attempted}" if Rails.env.development?
      
      # Check if today's records exist (AEST timezone)
      today_start = Date.current.in_time_zone('Australia/Sydney').beginning_of_day
      today_end = Date.current.in_time_zone('Australia/Sydney').end_of_day
      puts "Today's date range (AEST): #{today_start} to #{today_end}" if Rails.env.development?
      puts "Current time (AEST): #{Time.current.in_time_zone('Australia/Sydney')}" if Rails.env.development?
      
      today_completed = @user.user_quiz_progresses
        .where(completed: true)
        .where(created_at: today_start..today_end)
        .count
      today_attempted = @user.user_quiz_progresses
        .where(created_at: today_start..today_end)
        .count
      puts "Today's totals (AEST): completed=#{today_completed}, attempted=#{today_attempted}" if Rails.env.development?
      
      render json: {
        message: "Quiz completed successfully",
        progress: {
          id: progress.id,
          questions_answered: progress.questions_answered,
          questions_correct: progress.questions_correct,
          total_points: progress.total_points,
          score_percentage: total_questions > 0 ? (questions_correct.to_f / total_questions * 100).round(2) : 0,
          completed: progress.completed
        }
      }, status: 200
    else
      puts "❌ FAILED TO SAVE PROGRESS!" if Rails.env.development?
      puts "Validation errors: #{progress.errors.full_messages}" if Rails.env.development?
      puts "Progress object: #{progress.inspect}" if Rails.env.development?
      
      render json: { 
        error: "Failed to save quiz completion", 
        details: progress.errors.full_messages 
      }, status: 422
    end
  end


  def delete
    if params[:quiz_ids].present?
      
      puts "Attempting to delete quiz with ID: #{params[:quiz_ids]}" if Rails.env.development?
      quizzes = Quiz.where(id: params[:quiz_ids])
      quizzes.each do |quiz|
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
    quiz_obj = quiz_object(filtered_quizzes)

    # puts "quiz_obj: #{quiz_obj}" if Rails.env.development?
    puts "filtered_quizzes count: #{filtered_quizzes}" if Rails.env.development?
    puts "quiz_obj.first: #{quiz_obj.first[:quiz_title]}" if Rails.env.development?
      
    render json: { 
      topic: params[:topic], 
      total_questions: quiz_obj.length,
      questions: quiz_obj,
      quiz_title: quiz_obj.first ? quiz_obj.first[:quiz_title] : '',
      id: quiz_obj.first ? quiz_obj.first[:quiz_id] : nil
    }

    else
      render json: { error: "Missing topic parameter" }, status: 400
    end
  end

  

  def file_upload_extract
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

      # Check if quiz_data contains an error
      if quiz_data.is_a?(Hash) && quiz_data[:error]
        render json: { 
          error: "Quiz generation failed: #{quiz_data[:error]}" 
        }, status: :unprocessable_entity
        return
      end

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


  def quiz_object(filtered_quizzes)
    quiz_obj = []

    filtered_quizzes.each do |quiz|

      puts "Processing quiz: #{quiz.id}" if Rails.env.development?
      quiz.questions.each do |question|
        quiz_obj << {
            quiz_id: quiz.id,
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
    return quiz_obj
  end

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

  # Helper method to merge quiz and question activity data
  def merge_activity_data(quiz_data, question_data)
    merged_data = {}
    
    # Process quiz data
    quiz_data.each do |data|
      date = data[:date]
      merged_data[date] = {
        date: date,
        count: data[:count], # completed quizzes
        attempted: data[:attempted], # attempted quizzes
        questions_answered: 0,
        activity_type: 'combined'
      }
    end
    
    # Add question data
    question_data.each do |data|
      date = data[:date]
      if merged_data[date]
        merged_data[date][:questions_answered] = data[:count]
        # Combine counts (completed quizzes + questions answered)
        merged_data[date][:count] += data[:count]
      else
        merged_data[date] = {
          date: date,
          count: data[:count], # questions answered
          attempted: 0,
          questions_answered: data[:count],
          activity_type: 'combined'
        }
      end
    end
    
    merged_data.values.sort_by { |data| data[:date] }
  end

  # Test method to verify controller loading
  def test_method
    render json: { message: "Controller is working" }
  end

end
