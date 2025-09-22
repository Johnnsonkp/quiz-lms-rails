import { useEffect, useState } from 'react';

import SingleCardControls from '../controls/SingleCardControls';
import SingleComponentHeader from '../header/SingleComponentHeader';
import { SingleQuestionCard } from './SingleQuestion';

export default function SingleQuestionComponent({ quizData, selectedSubject, onBack }: any) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState<Record<string, boolean>>({});

  // Get questions directly from quizData.questions (flattened array from Rails)
  const allQuestions = quizData?.questions || [];
  
  // Filter questions by selected subject if needed, or use all questions
  const subjectQuestions = selectedSubject 
    ? allQuestions.filter((q: { subject: string }) => q.subject === selectedSubject.subject)
    : allQuestions;
    
  const currentQuestion = allQuestions[currentQuestionIndex];
  const currentQuestionHint = allQuestions[currentQuestionIndex]?.hint || null;
  const totalQuestions = allQuestions.length;

  // If no questions are available, show loading or empty state
  if (!quizData || totalQuestions === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
        </div>
        
        <div className="text-center py-12">
          <h1 className="text-lg font-bold text-gray-800 mb-1">{selectedSubject?.subject || 'Quiz'}</h1>
          <p className="text-gray-600 mb-4">{quizData?.topic || 'Loading...'}</p>
          <div className="text-gray-500">
            {!quizData ? 'Loading quiz data...' : `No questions available for ${selectedSubject?.subject || 'this topic'}.`}
          </div>
        </div>
      </div>
    );
  }

  const handleAnswerSelect = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
  };

  const handleShowResult = () => {
    setShowResults(prev => ({
      ...prev,
      [currentQuestion.id]: true
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setShowResults({});
    setCurrentQuestionIndex(0);
  };

  const calculateProgress = () => {
    const answeredQuestions = Object.keys(answers).length;
    return Math.round((answeredQuestions / totalQuestions) * 100);
  };

  const handleCompletion = () => {
    if(calculateProgress() === 100) {
      setTimeout(() => {
        alert('Quiz completed!');
      }, 3000)
    }
  }

  useEffect(() => {
    handleCompletion()
  }, [calculateProgress]);

  return (
    <div className="max-w-5xl mx-auto p-1">
      {/* Header */}
       <SingleComponentHeader 
        onBack={onBack} 
        currentQuestionIndex={currentQuestionIndex} 
        totalQuestions={totalQuestions}
        calculateProgress={calculateProgress} 
        answers={answers} 
        setCurrentQuestionIndex={setCurrentQuestionIndex}
        quizData={quizData}
        selectedSubject={selectedSubject}
      />

      <div className=''>
        <div className="mt-0 mb-4 max-w-2xl mx-auto">
          <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-2">
            {subjectQuestions.map((_: any, index: number) => {
              const isAnswered = answers[subjectQuestions[index].id];
              const isCurrent = index === currentQuestionIndex;
              
              return (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`text-xs rounded transition-colors ${
                    isCurrent 
                      ? 'bg-blue-600 text-white' 
                      : isAnswered 
                        ? 'bg-green-100 text-green-800 border border-green-300' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Question Card */}
        <SingleQuestionCard
          question={currentQuestion}
          selectedAnswer={answers[currentQuestion.id] || null}
          onAnswerSelect={handleAnswerSelect}
          showResult={showResults[currentQuestion.id] || false}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={totalQuestions}
          hint={currentQuestionHint}
        />

      </div>

      {/* Navigation Controls */}
      <SingleCardControls 
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        answers={answers}
        showResults={showResults}
        handlePrevious={handlePrevious}
        handleNext={handleNext}
        handleShowResult={handleShowResult}
        handleReset={handleReset}
        currentQuestion={currentQuestion}
      />
      
    </div>
  );
}
