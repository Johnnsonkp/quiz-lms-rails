# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_08_09_075626) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "questions", force: :cascade do |t|
    t.string "external_id"
    t.string "question_format"
    t.text "question"
    t.text "answer"
    t.jsonb "incorrect_answers"
    t.text "hint"
    t.text "explanation"
    t.string "difficulty"
    t.integer "estimated_time_seconds"
    t.jsonb "tags"
    t.jsonb "related_questions"
    t.string "source_reference"
    t.string "image_url"
    t.text "code_snippet"
    t.string "path"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["external_id"], name: "index_questions_on_external_id"
  end

  create_table "quiz_questions", force: :cascade do |t|
    t.bigint "quiz_id", null: false
    t.bigint "question_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["question_id"], name: "index_quiz_questions_on_question_id"
    t.index ["quiz_id"], name: "index_quiz_questions_on_quiz_id"
  end

  create_table "quizzes", force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.string "topic"
    t.string "subject"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "user_question_attempts", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "question_id", null: false
    t.boolean "correct"
    t.integer "points_awarded"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["question_id"], name: "index_user_question_attempts_on_question_id"
    t.index ["user_id"], name: "index_user_question_attempts_on_user_id"
  end

  create_table "user_quiz_progresses", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "quiz_id", null: false
    t.integer "questions_answered"
    t.integer "questions_correct"
    t.integer "total_points"
    t.boolean "completed"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["quiz_id"], name: "index_user_quiz_progresses_on_quiz_id"
    t.index ["user_id"], name: "index_user_quiz_progresses_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.index ["user_id"], name: "index_users_on_user_id"
  end

  add_foreign_key "quiz_questions", "questions"
  add_foreign_key "quiz_questions", "quizzes"
  add_foreign_key "user_question_attempts", "questions"
  add_foreign_key "user_question_attempts", "users"
  add_foreign_key "user_quiz_progresses", "quizzes"
  add_foreign_key "user_quiz_progresses", "users"
  add_foreign_key "users", "users"
end
