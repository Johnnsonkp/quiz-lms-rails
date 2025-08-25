import './header.css';

function DashboardBanner({handleBackToDashboard, selectedTopic, categories}: any) {
  return (
    <header 
      className="p-0 mx-auto relative h-[180px] w-[100%] mb-8 mt-0"
    >
      <button
        onClick={handleBackToDashboard}
        className="p-2 rounded-full hover:bg-white/20 transition-colors absolute top-3 left-5 flex align-middle items-center cursor-pointer text-bold z-30 text-white backdrop-blur-sm bg-black/20 text-sm px-3 hover:text-black/80"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span className="ml-1 font-medium">Back to Dashboard</span>
      </button>

      {/* Main Card with Blurred Background */}
      <div className="bg-card">
        <div className="bg-card-content">
          <h2 className="text-3xl text-black/80 font-medium font-roboto drop-shadow-lg mt-10">
            {selectedTopic}
          </h2>
          <p className="text-md text-black/50 font-medium pt-2 w-[80%] font-roboto drop-shadow-md">
            {categories.find((cat: any) => cat.topic === selectedTopic)?.description.slice(0, 150)}
          </p>
        </div>
      </div>
    </header>
  )
}

export default DashboardBanner