
function ProgressBar({ currentQuestionIndex, totalQuestions, calculateProgress }: any) {

  let progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="mb-4 w-[85%] mx-auto">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>Progress: {calculateProgress()}%</span>
        <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`${progress < 40? "bg-orange-600" : "bg-blue-600"} ${progress == 100 && "bg-green-300"} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  )
}

export default ProgressBar