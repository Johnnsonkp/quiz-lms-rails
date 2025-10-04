class StudyHour < ApplicationRecord
  belongs_to :user

  validates :date, presence: true, uniqueness: { scope: :user_id }
  validates :hours, presence: true, numericality: { greater_than: 0, less_than_or_equal_to: 24 }

  scope :for_date_range, ->(start_date, end_date) { where(date: start_date..end_date) }
  scope :for_user, ->(user) { where(user: user) }

  def self.daily_study_activity(user, start_date = nil, end_date = nil)
    start_date ||= 6.months.ago.to_date
    end_date ||= Date.current

    study_hours = for_user(user).for_date_range(start_date, end_date)
    
    study_hours.group(:date).sum(:hours).map do |date, total_hours|
      {
        date: date.to_s,
        count: total_hours.to_f,
        activity_type: 'study_hours'
      }
    end
  end

  def self.study_summary(user, start_date = nil, end_date = nil)
    start_date ||= 6.months.ago.to_date
    end_date ||= Date.current

    period_hours = for_user(user).for_date_range(start_date, end_date).sum(:hours)
    all_time_hours = for_user(user).sum(:hours)
    period_days = for_user(user).for_date_range(start_date, end_date).count
    all_time_days = for_user(user).count

    {
      total_hours: period_hours.to_f,
      total_days: period_days,
      all_time_hours: all_time_hours.to_f,
      all_time_days: all_time_days,
      average_per_day: period_days > 0 ? (period_hours.to_f / period_days).round(2) : 0
    }
  end
end