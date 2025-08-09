class CreateUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      # t.uuid :id

      t.timestamps
      t.references :user, foreign_key: true
    end

    
  end
end
