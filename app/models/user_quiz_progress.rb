class UserQuizProgress < ApplicationRecord
  belongs_to :user
  belongs_to :quiz

  # Calculate score percentage
  def score_percentage
    return 0 if questions_answered.nil? || questions_answered.zero?
    (questions_correct.to_f / questions_answered * 100).round(2)
  end

  # Check if quiz was passed (you can adjust the passing percentage)
  def passed?(passing_percentage = 70)
    score_percentage >= passing_percentage
  end

  # Get completion status as string
  def completion_status
    return 'completed' if completed?
    return 'in_progress' if questions_answered&.positive?
    'not_started'
  end
end
