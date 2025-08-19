import { useState } from "react";

function HintButton({hint}: {hint: string}) {
  const [showHint, setShowHint] = useState<boolean>(false);

  return (
    <div className="mb-6">
      <button
        onClick={() => setShowHint(!showHint)}
        className={`inline-flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer ${
          showHint 
            ? 'bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200 border-2' 
            : 'bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white shadow-sm hover:shadow-sm transform hover:-translate-y-0.5'
        }`}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-4 w-4 mr-2 transition-transform duration-200 ${showHint ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014.846 21H9.154a3.374 3.374 0 00-2.697-1.36l-.548-.547z" 
          />
        </svg>

        
        {showHint ? 'Hide Hint' : 'Need a Hint?'}
        {!showHint && (
          <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs bg-white/20 rounded-full">
            💡
          </span>
        )}
      </button>


    {showHint && (
        <div className="mt-3 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg transition-all duration-300 ease-in-out opacity-100 transform translate-y-0">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">💡 Hint</h3>
              <div className="mt-1 text-sm text-yellow-700">
                {hint}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HintButton