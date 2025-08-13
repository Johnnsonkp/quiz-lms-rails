
function QuizPage({ quiz_id }: { quiz_id: any }) {
  return (
    // <div>QuizPage</div>

  <section className="space-y-6">
      <header className="flex items-center space-x-4">
        <button
          // onClick={handleBackToDashboard}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-left !text-lg font-bold text-gray-800">QuizPage</h1>
          {/* <p className="text-left text-gray-600">Topic: {selectedSubject.topic}</p> */}
        </div>
      </header>

      {/* <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">Quiz component will be implemented here.</p>
        <p className="text-sm text-gray-500 mt-2">
          Selected: {selectedSubject.subject} from {selectedSubject.topic}
        </p>
      </div> */}

    </section>
  )
}

export default QuizPage