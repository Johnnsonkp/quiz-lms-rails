class CreateStudyHours < ActiveRecord::Migration[8.0]
  def change
    create_table :study_hours do |t|
      t.references :user, null: false, foreign_key: true
      t.date :date
      t.decimal :hours

      t.timestamps
    end
  end
end
