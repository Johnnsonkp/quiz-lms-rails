class AddNoteReferenceToQuizzes < ActiveRecord::Migration[8.0]
  def change
    add_reference :quizzes, :note, null: true, foreign_key: true
  end
end
