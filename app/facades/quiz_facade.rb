class QuizFacade < ApplicationController
  def initialize(quiz)
    @quiz = quiz
  end

  def formatted_questions
    @quiz.questions.map do |question|
      {
        id: question.external_id,
        type: question.question_format,
        question: question.question,
        answer: question.answer,
        incorrect_answers: question.incorrect_answers,
        tags: question.tags,
        path: question.path,
        hint: question.hint,
        explanation: question.explanation,
        tags: question.tags,
        path: question.path
      }
    end
  end

  def formatted_quiz
    {
      topic: @quiz.topic,
      subject: @quiz.subject,
      concepts: [
        {
          concept: @quiz.title,
          questions: formatted_questions
        }
      ]
    }
  end

  def formatted_questions

  end

end
