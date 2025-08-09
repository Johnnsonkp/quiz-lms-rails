class CreateQuestions < ActiveRecord::Migration[8.0]
  def change
    create_table :questions do |t|
      t.string :external_id
      t.string :question_format
      t.text :question
      t.text :answer
      t.jsonb :incorrect_answers
      t.text :hint
      t.text :explanation
      t.string :difficulty
      t.integer :estimated_time_seconds
      t.jsonb :tags
      t.jsonb :related_questions
      t.string :source_reference
      t.string :image_url
      t.text :code_snippet
      t.string :path
      # t.references :quiz, uuid: true, null: false, foreign_key: true

      t.timestamps
    end
    add_index :questions, :external_id
  end
end
