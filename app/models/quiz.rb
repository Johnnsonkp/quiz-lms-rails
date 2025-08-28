class Quiz < ApplicationRecord
  belongs_to :study_note, optional: true 
  has_many :quiz_questions
  has_many :questions, through: :quiz_questions
end
