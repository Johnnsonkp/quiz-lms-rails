class CreateNotes < ActiveRecord::Migration[8.0]
  def change
    create_table :notes do |t|
      t.string :title
      t.text :content
      t.references :user, null: false, foreign_key: true
      t.json :pdf_images # Metadata about extracted images

      t.timestamps
    end
  end
end
