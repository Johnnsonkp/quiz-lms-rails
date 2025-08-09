class CreateUserQuizProgresses < ActiveRecord::Migration[8.0]
  def change
    create_table :user_quiz_progresses do |t|
      t.references :user, null: false, foreign_key: true
      t.references :quiz, null: false, foreign_key: true
      t.integer :questions_answered
      t.integer :questions_correct
      t.integer :total_points
      t.boolean :completed

      t.timestamps
    end
  end
end
