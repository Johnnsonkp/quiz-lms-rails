import { EditIcon } from "../buttons/EditIcon";
import EditQuizQuestionForm from "../forms/EditQuizQuestionForm";
import ProgressBar from "../controls/ProgressBar";
import { useState } from "react";

function SingleComponentHeader(
  {
    onBack, 
    currentQuestionIndex, 
    totalQuestions, 
    calculateProgress, 
    selectedSubject,
    quizTitle,
    currentQuestion,
    onQuestionUpdate
  }: any ) {

  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  const handleEditClick = () => {
    if (currentQuestion) {
      setIsEditFormOpen(true);
    }
  };

  const handleEditFormClose = () => {
    setIsEditFormOpen(false);
  };

  const handleEditSuccess = (updatedQuestion: any) => {
    // Call the parent component's update function with the updated question data
    if (onQuestionUpdate) {
      onQuestionUpdate(updatedQuestion);
    }
  };

  return (
    <div className="mb-4 w-[100%] relative">
      <div className='absolute top-[-18px] w-[80vw] left-[-55px] bg-white-100 px-5 !mx-0 flex justify-between align-middle border-b-2 border-gray-200 shadow-xs py-1'>
        <button
          onClick={onBack}
          className="flex flex-[0.2] !text-[15px] items-center text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <button
          className="flex items-center gap-1 px-2 py-1 border-1 border-gray-200 rounded-sm bg-white/80 hover:bg-white transition-colors cursor-pointer"
          onClick={handleEditClick}
          aria-label="Edit"
          type="button"
        >
          <EditIcon />
          <span className="text-sm font-medium text-gray-700">Edit</span>
        </button>
      </div>
      
      <div className='flex justify-center items-start align-middle w-[100%] pt-8'>
        {/* <button
          onClick={onBack}
          className="flex flex-[0.2] !text-[15px] items-center text-blue-600 hover:text-blue-800 mt-2 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button> */}
        
        <div className="flex flex-col flex-[0.8] items-center text-center mb-2">
          <h1 className="text-2xl font-semibold text-gray-900">
            {selectedSubject && selectedSubject? selectedSubject : ""}
          </h1>
          <div className="flex items-center pt-1">
            <span className="text-gray-500 text-sm">
              {selectedSubject?.subject || ""}
            </span>
            <span className="text-blue-500 text-md font-normal">
              {quizTitle || ""}
            </span>
          </div>
        </div>

        {/* <div className="text-center mb-6 flex-[0.3]">
        </div> */}

        {/* <button
          className="absolute top-0 right-10 z-20 flex items-center gap-1 p-2 rounded-md bg-white/80 hover:bg-white transition-colors shadow cursor-pointer"
          onClick={handleEditClick}
          aria-label="Edit"
          type="button"
        >
          <EditIcon />
          <span className="text-sm font-medium text-gray-700">Edit</span>
        </button> */}
      </div>

        {/* Progress Bar */}
        <ProgressBar 
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
          calculateProgress={calculateProgress}
        />

        {/* Edit Question Form */}
        {currentQuestion && (
          <EditQuizQuestionForm
            question={currentQuestion}
            isOpen={isEditFormOpen}
            onClose={handleEditFormClose}
            onSuccess={handleEditSuccess}
          />
        )}
      </div>
  )
}

export default SingleComponentHeader