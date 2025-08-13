import React, { useEffect, useState } from 'react';

export function SingleQuestionCard({ 
  question, 
  selectedAnswer, 
  onAnswerSelect, 
  showResult,
  questionNumber,
  totalQuestions 
}: any) {
  // Combine correct answer with incorrect answers and shuffle
  const allAnswers = [question.answer, ...(question.incorrect_answers || [])];
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);

  useEffect(() => {
    // Shuffle answers when component mounts or question changes
    const shuffled = [...allAnswers].sort(() => Math.random() - 0.5);
    setShuffledAnswers(shuffled);
  }, [question.id]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border-none max-w-4xl mx-auto">
      {/* Question Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500 uppercase tracking-wide">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-sm text-blue-600 font-medium">ID: {question.id}</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 leading-relaxed">
          {question.question}
        </h2>
      </div>

      {/* Answer Options */}
      <div className="space-y-3 mb-6">
        {shuffledAnswers.map((answer, index) => {
          const isSelected = selectedAnswer === answer;
          const isCorrectAnswer = answer === question.answer;
          
          let buttonClass = "w-full p-4 text-left border rounded-lg transition-all duration-200 ";
          
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
              <div className="flex items-center">
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
  );
}