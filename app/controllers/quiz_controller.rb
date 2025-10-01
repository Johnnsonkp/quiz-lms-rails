class QuizController < ApplicationController
  def index
    @quizzes = Quiz.all
    render inertia: 'quiz/Index', props: { quizzes: @quizzes }
  end

  def show
    @quiz = Quiz.find(params[:id])
    render inertia: 'quiz/Show', props: { quiz: @quiz }
  end

end