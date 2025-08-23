import HintButton from '../buttons/HintButton';
import QuestionOptions from './QuestionOptions';
import { SingleQuestionCardProps } from '../../../types/dashboard';

export function SingleQuestionCard({ 
  question, 
  selectedAnswer, 
  onAnswerSelect, 
  showResult,
  questionNumber,
  totalQuestions,
  hint 
}: SingleQuestionCardProps) {

  return (
    <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">

      {/* Image section */}
      <div className="hidden lg:block lg:w-1/2 bg-cover"
          style={{ 
            // backgroundImage: "url('https://images.unsplash.com/photo-1546514714-df0ccc50d7bf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80')" 
            backgroundImage: `url(${question?.image})` 
          }}
      >
      </div>

      {/* Quiz card */}
      <div className="bg-white p-4 rounded-lg shadow-lg border-none max-w-4xl mx-auto">
        {/* Question Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500 uppercase tracking-wide">
              Question {questionNumber} of {totalQuestions}
            </span>
            <span className="text-sm text-blue-400 font-medium">ID: {question.id}</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 leading-relaxed">
            {question.question}
          </h2>
        </div>

        {/* Answer Options */}
        <QuestionOptions 
          question={question}
          showResult={showResult}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={onAnswerSelect}
        />

        {hint && (<HintButton hint={hint}/>)}

        {/* Question Details */}
        {showResult && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="mb-2">
              <span className="font-medium text-gray-700">Correct Answer:</span>
              <span className="ml-2 text-gray-800">{question.answer}</span>
            </div>
            {question.explanation && (
              <div className="mb-2">
                <span className="font-medium text-gray-700">Explanation:</span>
                <span className="ml-2 text-gray-800">{question.explanation}</span>
              </div>
            )}
            {question.tags && question.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                <span className="text-sm text-gray-600">Tags:</span>
                {question.tags.map((tag: string) => (
                  <span key={tag} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}