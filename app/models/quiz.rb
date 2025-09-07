class Quiz < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :study_note, optional: true 
  has_many :quiz_questions
  has_many :questions, through: :quiz_questions

  # Scopes for filtering quizzes
  scope :for_user, ->(user) { where(user: user) }
  scope :public_quizzes, -> { where(user: nil) }
end
