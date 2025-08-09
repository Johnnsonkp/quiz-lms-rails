class DashboardController < ApplicationController
  before_action :categories
  before_action :get_all_quiz, only: [:index]

  def index
    render inertia: 'dashboard/Dashboard', props: { categories: @categories, quizzes: @result }
  end

  private

  def categories
    @categories = Quiz.all.pluck(:topic).uniq
  end

  def get_all_quiz
    quizzes = Quiz.includes(:questions)
    # quizzes_q = QuizFacade.new(quizzes).formatted_questions
    group_by_attrs = [:topic, :subject]
    grouped = quizzes.group_by { |q| group_by_attrs.map { |attr| q.send(attr) } }

    @result = grouped.map do |(topic, subject), quizzes|
      {
        topic: topic,
        subject: subject,
        concepts: quizzes.map do |quiz|
          {
            concept: quiz.title,
            questions: quiz.questions.map do |q|
              {
                id: q.external_id,
                type: q.question_format,
                question: q.question,
                answer: q.answer,
                incorrect_answers: q.incorrect_answers,
                tags: q.tags,
                path: q.path
              }
            end
          }
        end
      }
    end

    puts "Grouped Quizzes: #{@result.inspect}" if Rails.env.development?

  end

end
