import './header.css';

import BackButton from '../../buttons/BackButton';
import { EditIcon } from '../../buttons/EditIcon';

function DashboardBanner({setEditStatus, handleBackToDashboard, selectedTopic, titles}: any) {
  // const urlParams = new URLSearchParams(window.location.pathname);

  return (
    <header className="p-0 mx-auto relative h-[120px] w-[100%] mb-5 mt-0 shadow-md rounded-lg bg-[#D1D7E3]">
      <BackButton onClick={handleBackToDashboard} />

      <button
        className="absolute top-3 right-10 z-20 flex items-center gap-1 p-2 rounded-md bg-white/80 hover:bg-white transition-colors shadow cursor-pointer"
        onClick={() => setEditStatus((prev: boolean) => !prev)}
        aria-label="Edit"
        type="button"
      >
        <EditIcon />
        <span className="text-sm font-medium text-gray-700">Edit</span>
      </button>

      <div className="bg-card">
        <div className="bg-card-content">

          {/* <h2 className="text-2xl text-black/80 font-medium font-roboto drop-shadow-lg mt-7 mb-3">
            {selectedTopic} / 
            <span className="text-black/70 font-medium text-[14px] mx-2">{urlParams.get('title') || 'All Topics'}</span>
          </h2> */}

          <h2 className="text-2xl text-black/80 font-medium font-roboto drop-shadow-lg mt-7 mb-3">
            Dashboard / 
            <span className="text-black/70 font-medium text-[14px] mx-2">{selectedTopic}</span>
          </h2>
          
        </div>
      </div>
    </header>
  )
}

export default DashboardBanner

