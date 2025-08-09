class CreateUserQuestionAttempts < ActiveRecord::Migration[8.0]
  def change
    create_table :user_question_attempts do |t|
      t.references :user, null: false, foreign_key: true
      t.references :question, null: false, foreign_key: true
      t.boolean :correct
      t.integer :points_awarded

      t.timestamps
    end
  end
end
