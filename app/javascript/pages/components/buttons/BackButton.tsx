function BackButton({onClick}: {onClick?: () => void}) {
  return (
    <button onClick={onClick}
        className="p-1 rounded-full hover:bg-white/20 transition-colors absolute top-2 left-2 flex align-middle items-center cursor-pointer text-bold z-20  backdrop-blur-sm bg-white/10 text-blue-500 text-sm px-1 hover:text-black/70 w-[180px]"
    >
      <svg width="10%" height="" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="ml-1 font-medium text-sm">Back to Dashboard</span>
    </button>
  )
}

export default BackButton