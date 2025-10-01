class AddUserToQuizzes < ActiveRecord::Migration[8.0]
  def change
    add_reference :quizzes, :user, null: true, foreign_key: true
  end
end
