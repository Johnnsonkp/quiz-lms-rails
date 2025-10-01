class ChangeUserIdToOptionalInNotes < ActiveRecord::Migration[8.0]
  def change
    change_column_null :notes, :user_id, true
  end
end
