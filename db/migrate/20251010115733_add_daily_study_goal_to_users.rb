class AddDailyStudyGoalToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :daily_study_goal_hours, :decimal, precision: 4, scale: 2, default: 8.0
  end
end
