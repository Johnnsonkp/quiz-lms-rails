class User < ApplicationRecord
    # Add Devise modules to your existing model
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :omniauthable, omniauth_providers: [:google_oauth2, :github, :facebook]

  def self.from_omniauth(auth)
    where(email: auth.info.email).first_or_create do |user|
      user.email = auth.info.email
      user.password = Devise.friendly_token[0, 20]
      user.name = auth.info.name
      user.provider = auth.provider
      user.uid = auth.uid
    end
  end
  
  # Quiz associations
  has_many :quizzes, dependent: :destroy
  has_many :user_quiz_progresses, dependent: :destroy
  has_many :user_question_attempts, dependent: :destroy

  # Study hours association
  has_many :study_hours, dependent: :destroy

  # Notes associations
  has_many :notes, dependent: :destroy

  # Tracking methods for heatmap data
  def completed_quizzes_count
    user_quiz_progresses.where(completed: true).count
  end
  
  def attempted_quizzes_count
    user_quiz_progresses.count
  end

  # Heatmap data generation methods
  def daily_quiz_activity(start_date: 365.days.ago, end_date: Date.current)
    # Convert dates to ensure we're working with Date objects
    start_date = start_date.to_date
    end_date = end_date.to_date
    
    # Get completed quiz progresses in date range
    completed_progresses = user_quiz_progresses
      .where(completed: true)
      .where(created_at: start_date.beginning_of_day..end_date.end_of_day)
      .select(:created_at)

    # Get all quiz progresses in date range  
    all_progresses = user_quiz_progresses
      .where(created_at: start_date.beginning_of_day..end_date.end_of_day)
      .select(:created_at)

    # Group by date using Ruby (AEST timezone-aware)
    completed_counts = completed_progresses.group_by { |p| p.created_at.in_time_zone('Australia/Sydney').to_date.to_s }.transform_values(&:count)
    attempted_counts = all_progresses.group_by { |p| p.created_at.in_time_zone('Australia/Sydney').to_date.to_s }.transform_values(&:count)

    puts "DEBUG - completed_counts: #{completed_counts}" if Rails.env.development?
    puts "DEBUG - attempted_counts: #{attempted_counts}" if Rails.env.development?
    puts "DEBUG - start_date: #{start_date}, end_date: #{end_date}" if Rails.env.development?
    puts "DEBUG - using timezone: Australia/Sydney (AEST)" if Rails.env.development?

    # Generate heatmap data
    generate_heatmap_data(start_date, end_date, completed_counts, attempted_counts)
  end

  def daily_question_activity(start_date: 365.days.ago, end_date: Date.current)
    # Convert dates to ensure we're working with Date objects
    start_date = start_date.to_date
    end_date = end_date.to_date
    
    # Get question attempts in date range
    question_attempts = user_question_attempts
      .where(created_at: start_date.beginning_of_day..end_date.end_of_day)
      .select(:created_at)

    # Group by date using Ruby (AEST timezone-aware)
    question_counts = question_attempts.group_by { |p| p.created_at.in_time_zone('Australia/Sydney').to_date.to_s }.transform_values(&:count)

    # Generate heatmap data for questions
    generate_question_heatmap_data(start_date, end_date, question_counts)
  end

  # Study goal tracking methods
  def today_study_hours_aest
    aest_today = Date.current.in_time_zone('Australia/Sydney')
    study_hours.where(date: aest_today).sum(:hours) || 0.0
  end

  def study_goal_progress
    goal = daily_study_goal_hours || 8.0
    actual = today_study_hours_aest
    progress_percentage = goal > 0 ? [(actual / goal * 100).round(1), 100].min : 0
    hours_remaining = [goal - actual, 0].max

    {
      goal_hours: goal,
      actual_hours: actual.round(2),
      progress_percentage: progress_percentage,
      hours_remaining: hours_remaining.round(2),
      status: determine_study_status(progress_percentage),
      is_goal_achieved: progress_percentage >= 100
    }
  end

  private

  def determine_study_status(percentage)
    return 'completed' if percentage >= 100
    return 'on-track' if percentage >= 80
    return 'behind' if percentage >= 50
    'far-behind'
  end

  def generate_heatmap_data(start_date, end_date, completed_counts, attempted_counts)
    (start_date.to_date..end_date.to_date).map do |date|
      date_str = date.to_s
      {
        date: date_str,
        count: completed_counts[date_str] || 0,
        attempted: attempted_counts[date_str] || 0,
        activity_type: 'quiz'
      }
    end
  end

  def generate_question_heatmap_data(start_date, end_date, question_counts)
    (start_date.to_date..end_date.to_date).map do |date|
      date_str = date.to_s
      {
        date: date_str,
        count: question_counts[date_str] || 0,
        activity_type: 'question'
      }
    end
  end
end
