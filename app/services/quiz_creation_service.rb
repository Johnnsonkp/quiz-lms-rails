class QuizCreationService
  def self.call(quiz_data, user = nil, note = nil)
    new(quiz_data, user, note).call
  end

  def initialize(quiz_data, user, note = nil)
    @quiz_data = quiz_data
    @user = user
    @note = note
  end

  def call
    return nil unless @quiz_data.present?

    begin
      # Create the Quiz record
      quiz = Quiz.create!(
        topic: @quiz_data['topic'],
        subject: @quiz_data['subject'], 
        title: @quiz_data['title'],
        description: @quiz_data['description'],
        user_id: @user&.id,
        note_id: @note&.id
      )

      # Create Question records and associate them with the quiz
      @quiz_data['questions'].each do |question_data|
        question = Question.create!(
          external_id: question_data['external_id'],
          question_format: question_data['question_format'],
          question: question_data['question'],
          answer: question_data['answer'],
          incorrect_answers: question_data['incorrect_answers'],
          hint: question_data['hint'],
          explanation: question_data['explanation'],
          difficulty: question_data['difficulty'],
          estimated_time_seconds: question_data['estimated_time_seconds'],
          tags: question_data['tags'],
          path: question_data['path']
        )

        # Create the join table relationship
        QuizQuestion.create!(
          quiz: quiz,
          question: question
        )
      end

      quiz
    rescue => e
      Rails.logger.error "Error saving quiz to database: #{e.message}"
      nil
    end
  end
end