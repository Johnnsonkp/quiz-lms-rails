# app/models/note.rb
class StudyNote < ApplicationRecord
  belongs_to :user
  has_many :quizzes, dependent: :destroy
  
  # Fields you might want:
  # title:string
  # content:text 
  # file_path:string (if storing file uploads)
  # created_at, updated_at
end