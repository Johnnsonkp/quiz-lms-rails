import React from 'react'

function SingleComponentHeader(
  {
    onBack, 
    currentQuestionIndex, 
    totalQuestions, 
    calculateProgress, 
    quizData, 
    selectedSubject
  }: any ) {
  return (
    <div className="mb-4">
      <div className='flex justify-between items-center align-middle'>
        <button
          onClick={onBack}
          className="flex flex-[0.2] !text-[15px] items-center bg-[#f4f4f4] text-blue-600 hover:text-blue-800 mb-1 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>
        
        <div className="text-center mb-6 flex-[0.3]">
          <h1 className="!text-3xl font-bold text-gray-800 mb-0">
            {selectedSubject?.subject || quizData?.topic || 'Quiz'}
          </h1>
          <p className="text-gray-600">Navigate through {totalQuestions} questions</p>
        </div>

        <div className="text-center mb-6 flex-[0.3]">
          {/* <h1 className="!text-4xl font-bold text-gray-800 mb-2">{subject.subject}</h1> */}
          {/* <p className="text-gray-600">Navigate through {totalQuestions} questions</p> */}
        </div>


      </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress: {calculateProgress()}%</span>
            <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
  )
}

export default SingleComponentHeader