import './header.css';

import React from 'react';

function DashboardBanner({setEditStatus, handleBackToDashboard, selectedTopic, titles}: any) {
  const [startIndex, setStartIndex] = React.useState(0);

  return (
    <header className="p-0 mx-auto relative h-[150px] w-[100%] mb-5 mt-0 shadow-md rounded-lg bg-[#D1D7E3]">

      <button onClick={handleBackToDashboard}
         className="p-1 rounded-full hover:bg-white/20 transition-colors absolute top-2 left-2 flex align-middle items-center cursor-pointer text-bold z-20  backdrop-blur-sm bg-white/10 text-blue-500 text-sm px-1 hover:text-black/70 w-[180px]"
      >
        <svg width="10%" height="" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="ml-1 font-medium text-sm">Back to Dashboard</span>
      </button>

      {/* An Edit Button with icon */}
      <button
        className="absolute top-3 right-10 z-20 flex items-center gap-1 p-2 rounded-md bg-white/80 hover:bg-white transition-colors shadow cursor-pointer"
        onClick={() => setEditStatus((prev: boolean) => !prev)}
        aria-label="Edit"
        type="button"
      >
        <svg
          className="w-4 h-4 text-gray-700"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
        d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H7v-3a2 2 0 01.586-1.414z"
        strokeLinecap="round"
        strokeLinejoin="round"
          />
        </svg>
        <span className="text-sm font-medium text-gray-700">Edit</span>
      </button>

      {/* Main Card with Blurred Background */}
      <div className="bg-card">
        <div className="bg-card-content">

          <h2 className="text-3xl text-black/80 font-medium font-roboto drop-shadow-lg mt-7 mb-3">
            {selectedTopic}
          </h2>
          
            <div className="flex items-center pt-3 w-full">
            {titles && titles?.length > 1? 
              (<>
                <button
                  className="p-1 px-1 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 mr-2 disabled:opacity-50 cursor-pointer"
                  onClick={() => setStartIndex((prev: number) => Math.max(prev - 1, 0))}
                  disabled={startIndex === 0}
                  aria-label="Previous"
                  type="button"
                >
                  &#8592;
                </button>

            <div className="flex flex-wrap gap-2 flex-1">
              {titles && titles
                .filter(Boolean)
                .slice(startIndex, startIndex + 4)
                .map((title: string, index: number) => (

                <span key={startIndex + index}
                  className="inline-block bg-gray-200 rounded-full px-3 py-1 text-md font-medium text-gray-800 cursor-pointer"
                >
                  {title}
                </span>))}
            </div>

            <button
              className="p-1 px-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 ml-2 disabled:opacity-50 cursor-pointer"
              onClick={() => setStartIndex((prev: number) => Math.min(prev + 1, Math.max(0, titles.filter(Boolean).length - 4)))}
              disabled={titles && startIndex + 4 >= titles.filter(Boolean).length}
              aria-label="Next"
              type="button"
            >
              &#8594;
            </button></>) : 
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-md font-medium text-gray-800 cursor-pointer">
                  {titles}
                </span>
            }
            </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardBanner

