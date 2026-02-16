import quizIcon from '../../../assets/quiz-icon.png';

function AppLogo({showSidebar, showTitle}: {showSidebar?: boolean, showTitle?: boolean}) {
  return (
    <a href="/" className="flex items-center space-x-2 min-w-0">
      <img 
        src={quizIcon} 
        alt="Quiz Logo" 
        className="w-8 h-8 flex-shrink-0 transition-transform duration-300 hover:scale-110" 
      />
      <h1 className={`
        font-bold text-xl text-gray-800 whitespace-nowrap
        transition-all duration-300 ease-in-out
        ${showSidebar && showSidebar ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}
        ${showTitle === false ? 'hidden' : 'block'}
      `}>
        QLearn
      </h1>
    </a>
  )
}

export default AppLogo