import './header.css';

function DashboardBanner({handleBackToDashboard, selectedTopic, titles}: any) {
  return (
    <header className="p-0 mx-auto relative h-[150px] w-[100%] mb-5 mt-0 shadow-md rounded-lg bg-[#D1D7E3]">
      <button onClick={handleBackToDashboard}
         className="p-1 rounded-full hover:bg-white/20 transition-colors absolute top-2 left-2 flex align-middle items-center cursor-pointer text-bold z-30  backdrop-blur-sm bg-white/10 text-blue-500 text-sm px-1 hover:text-black/70 w-[180px]"
      >
        <svg width="11%" height="" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="ml-1 font-medium text-xs">Back to Dashboard</span>
      </button>

      {/* Main Card with Blurred Background */}
      <div className="bg-card">
        <div className="bg-card-content">
          <h2 className="text-3xl text-black/80 font-medium font-roboto drop-shadow-lg mt-10">
            {selectedTopic}
          </h2>
          <p className="text-md text-black/50 font-medium pt-3 w-[100%] font-roboto drop-shadow-sm">
            {titles && titles.map((title: string, index: number) => (
                <span key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-xs font-medium text-gray-800 mr-2 mt-2 mb-2">
                  {title}
                </span>
              ))}
          </p>
        </div>
      </div>
    </header>
  )
}

export default DashboardBanner

