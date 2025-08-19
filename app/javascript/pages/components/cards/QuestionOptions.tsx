import { useEffect, useState } from 'react';

interface QuestionOptionsProps {
  question: {
    id: number;
    question: string;
    answer: string;
    incorrect_answers: string[];
  };
  showResult: boolean;
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
}

function QuestionOptions({ question, showResult, selectedAnswer, onAnswerSelect }: QuestionOptionsProps) {
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);
  const allAnswers = [question.answer, ...(question.incorrect_answers || [])];

  useEffect(() => {
    // Shuffle answers when component mounts or question changes
    const shuffled = [...allAnswers].sort(() => Math.random() - 0.5);
    setShuffledAnswers(shuffled);
  }, [question.id]);

  
  return (
    <div className="space-y-3 mb-6">
        {shuffledAnswers.map((answer, index) => {
          const isSelected = selectedAnswer === answer;
          const isCorrectAnswer = answer === question.answer;
          let buttonClass = "w-full p-3 text-left border-1 border-silver-100 rounded-lg transition-all duration-200 cursor-pointer";
          
          if (showResult) {
            if (isCorrectAnswer) {
              buttonClass += "bg-green-50 border-green-400 text-green-800 ring-2 ring-green-200";
            } else if (isSelected && !isCorrectAnswer) {
              buttonClass += "bg-red-50 border-red-400 text-red-800 ring-2 ring-red-200";
            } else {
              buttonClass += "bg-gray-50 border-gray-300 text-gray-600";
            }
          } else {
            if (isSelected) {
              buttonClass += "bg-blue-50 border-blue-400 text-blue-800 ring-2 ring-blue-200";
            } else {
              buttonClass += "bg-gray-50 border-gray-300 hover:bg-gray-100 text-gray-800 hover:border-gray-400";
            }
          }

          return (
            <button
              key={index}
              onClick={() => !showResult && onAnswerSelect(answer)}
              disabled={showResult}
              className={buttonClass}
            >
              <div className="flex items-center cursor-pointer">
                <span className="mr-4 text-sm font-semibold min-w-[24px] h-6 bg-white rounded-full flex items-center justify-center border">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1">{answer}</span>
                {showResult && isCorrectAnswer && (
                  <span className="ml-auto text-green-600 text-lg">✓</span>
                )}
                {showResult && isSelected && !isCorrectAnswer && (
                  <span className="ml-auto text-red-600 text-lg">✗</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
  )
}

export default QuestionOptions