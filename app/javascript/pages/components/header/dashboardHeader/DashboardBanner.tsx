import './header.css';

import React from 'react';

function DashboardBanner({setEditStatus, handleBackToDashboard, selectedTopic, titles}: any) {

  const urlParams = new URLSearchParams(window.location.pathname);

  const EditIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M19 13.66V19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.34" />
      <path d="m17 1 4 4-10 10H7v-4z" />
    </svg>
  );

  return (
    <header className="p-0 mx-auto relative h-[120px] w-[100%] mb-5 mt-0 shadow-md rounded-lg bg-[#D1D7E3]">

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
        <EditIcon />
        <span className="text-sm font-medium text-gray-700">Edit</span>
      </button>

      {/* Main Card with Blurred Background */}
      <div className="bg-card">
        <div className="bg-card-content">

          <h2 className="text-2xl text-black/80 font-medium font-roboto drop-shadow-lg mt-7 mb-3">
            {selectedTopic} / 
            <span className="text-black/70 font-medium text-[14px] mx-2">{urlParams.get('title') || titles?.[0] || 'All Topics'}</span>
          </h2>
          
        </div>
      </div>
    </header>
  )
}

export default DashboardBanner

