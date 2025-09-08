import ProgressBar from "../controls/ProgressBar";

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
          {/* <p className="text-gray-600">Navigate through {totalQuestions} questions</p> */}
          <p className="text-gray-600">{selectedSubject && selectedSubject? selectedSubject : ""}</p>
        </div>

        <div className="text-center mb-6 flex-[0.3]">
          {/* <h1 className="!text-4xl font-bold text-gray-800 mb-2">{subject.subject}</h1> */}
          {/* <p className="text-gray-600">Navigate through {totalQuestions} questions</p> */}
        </div>
      </div>

        {/* Progress Bar */}
        <ProgressBar 
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
          calculateProgress={calculateProgress}
        />
      </div>
  )
}

export default SingleComponentHeader