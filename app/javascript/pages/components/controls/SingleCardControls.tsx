function SingleCardControls(
  { 
    currentQuestionIndex, 
    totalQuestions, 
    answers, 
    showResults, 
    handlePrevious, 
    handleNext, 
    handleShowResult, 
    handleReset, 
    currentQuestion,
    
  }: any) {
  return (
    <div className="flex justify-between items-center mt-8 max-w-lg mx-auto">
      <button
        onClick={handlePrevious}
        disabled={currentQuestionIndex === 0}
        className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Previous
      </button>

      <div className="flex gap-3">
        {answers[currentQuestion.id] && !showResults[currentQuestion.id] && (
          <button
            onClick={handleShowResult}
            className="px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Show Answer
          </button>
        )}
        
        <button
          onClick={handleReset}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Reset All
        </button>
      </div>

      <button
        onClick={handleNext}
        disabled={currentQuestionIndex === totalQuestions - 1}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        Next
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
)
}

export default SingleCardControls