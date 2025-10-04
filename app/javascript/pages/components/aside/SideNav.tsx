import { useEffect, useState } from 'react';

import { Category } from '../../../types/dashboard';
import CategoryIcons from '../icons/CategoryIcons';
import Divider from '../divider/Divider';
import SideNavUserBadge from '../ui/SideNavUserBadge';
import quizIcon from '../../../assets/quiz-icon.png';

function SideNav({categories, handleTopicClick, activeSection, showSidebar, quizData, selectedSubject, setShowSidebar, user}: 
  {
    categories: Category[];
    handleTopicClick: (topic: string) => void;
    activeSection: string;
    showSidebar: boolean;
    quizData: any;
    selectedSubject: any;
    setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
    user: any;
  }) {

  const [questions, setQuestions] = useState(quizData?.questions || []);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    categories: true, // Default open
    questions: true
  });

   useEffect(() => {
      if (quizData?.questions) {
        setQuestions(quizData.questions);
      }
    }, [quizData]);
  
  const allQuestions = questions;
  const subjectQuestions = selectedSubject 
    ? allQuestions.filter((q: { subject: string }) => q.subject === selectedSubject.subject)
    : allQuestions;

  console.log("Subject Questions in SideNav:", subjectQuestions);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen z-30 
        bg-white shadow-lg border-r border-gray-200
        transition-all duration-300 ease-in-out
        ${showSidebar ? 'w-64' : 'w-16'}
        ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 overflow-x-hidden
      `}
    >
      {/* Header with Logo and Collapse Button */}
      <div className="flex justify-between items-center h-16 px-4 border-b border-gray-200">
        <a href="/" className="flex items-center space-x-2 min-w-0">
          <img 
            src={quizIcon} 
            alt="Quiz Logo" 
            className="w-8 h-8 flex-shrink-0 transition-transform duration-300 hover:scale-110" 
          />
          <h1 className={`
            font-bold text-xl text-gray-800 whitespace-nowrap
            transition-all duration-300 ease-in-out
            ${showSidebar ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}
          `}>
            QLearn
          </h1>
        </a>
        
        <button 
          // onClick={() => setOpen(!open)} 
          onClick={() => setShowSidebar(!showSidebar)}
          className={`
            p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100
            transition-all duration-200 ease-in-out cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
            ${!showSidebar ? 'ml-auto' : ''}
          `}
          aria-label={showSidebar ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className={`
              w-5 h-5 transition-transform duration-300 ease-in-out
              ${!showSidebar ? 'rotate-180' : ''}
            `}
          >
            <path d="M3.75 8.5C3.75 8.08579 4.08579 7.75 4.5 7.75H5.75C6.16421 7.75 6.5 8.08579 6.5 8.5C6.5 8.91421 6.16421 9.25 5.75 9.25H4.5C4.08579 9.25 3.75 8.91421 3.75 8.5ZM3.75 12C3.75 11.5858 4.08579 11.25 4.5 11.25H5.75C6.16421 11.25 6.5 11.5858 6.5 12C6.5 12.4142 6.16421 12.75 5.75 12.75H4.5C4.08579 12.75 3.75 12.4142 3.75 12ZM3.75 15.5C3.75 15.0858 4.08579 14.75 4.5 14.75H5.75C6.16421 14.75 6.5 15.0858 6.5 15.5C6.5 15.9142 6.16421 16.25 5.75 16.25H4.5C4.08579 16.25 3.75 15.9142 3.75 15.5ZM4.25 3C2.45507 3 1 4.45507 1 6.25V17.75C1 19.5449 2.45508 21 4.25 21H19.75C21.5449 21 23 19.5449 23 17.75V6.25C23 4.45507 21.5449 3 19.75 3H4.25ZM19.75 19.5H9V4.5H19.75C20.7165 4.5 21.5 5.2835 21.5 6.25V17.75C21.5 18.7165 20.7165 19.5 19.75 19.5ZM4.25 4.5H7.5V19.5H4.25C3.2835 19.5 2.5 18.7165 2.5 17.75V6.25C2.5 5.2835 3.2835 4.5 4.25 4.5Z"></path>
          </svg>
        </button>
      </div>

      {/* Content Area with Smooth Scrolling */}
      <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <Divider />
        
        {activeSection == "quiz" && questions ? 
          <nav className="py-4">
            <button 
              onClick={() => toggleSection('questions')}
              className="w-full px-4 flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
              aria-expanded={expandedSections.questions}
              aria-controls="questions-content"
            >
              <h3 className={`
                text-sm font-medium text-gray-500 mb-3
                transition-all duration-300 ease-in-out
                ${showSidebar ? 'opacity-100' : 'opacity-0 hidden'}
              `}>
                {questions.length} question{questions.length !== 1 ? 's' : ''}
              </h3>
              <svg 
                className={`ml-2 h-5 w-5 transform transition-transform duration-200 ${
                  expandedSections.questions ? 'rotate-180' : ''
                }`} 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            <div 
              id="questions-content"
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                expandedSections.questions ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <ul className="space-y-1 px-2">
              {questions && questions.map((q: any, index: number) => (
                <li key={index}>
                  <a href="#"
                    className={`
                      flex items-center px-3 py-2 rounded-lg
                      hover:bg-gray-100 transition-all duration-200 ease-in-out
                      group relative
                      ${activeSection === q?.question ? 'bg-blue-50 border-r-2 border-blue-500' : ''}
                    `}
                    onClick={(e) => {
                      e.preventDefault();
                      // handleTopicClick();
                    }}
                  >
                    <div className={`
                      flex items-center min-w-0 w-full
                      ${!showSidebar ? 'justify-center' : 'space-x-3'}
                    `}>
                      <span className={`
                        flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600
                        flex items-center justify-center text-xs font-medium
                        transition-all duration-200
                        ${activeSection === q?.question ? 'bg-blue-500 text-white' : ''}
                      `}>
                        {index + 1}
                      </span>
                      
                      <span className={`
                        text-gray-700 text-sm font-medium truncate
                        transition-all duration-300 ease-in-out
                        ${showSidebar ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 absolute pointer-events-none'}
                      `}>
                        {q?.question}
                      </span>
                      
                      {/* Tooltip for collapsed state */}
                      {!showSidebar && (
                        <div className="
                          absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg
                          opacity-0 group-hover:opacity-100 transition-opacity duration-200
                          pointer-events-none whitespace-nowrap z-50
                          transform translate-y-0
                        ">
                          {q?.question}
                          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 
                                        border-4 border-transparent border-r-gray-900"></div>
                        </div>
                      )}
                    </div>
                  </a>
                </li>
              ))}
              </ul>
            </div>
          </nav>
        :
          <nav className="py-4">
            <button 
              onClick={() => toggleSection('categories')}
              className={`w-full px-4 flex justify-between items-center hover:bg-gray-50 transition-colors duration-200 py-2 cursor-pointer mb-2 ${showSidebar ? 'opacity-100' : 'opacity-0 hidden'} `}
              aria-expanded={expandedSections.categories}
              aria-controls="categories-content"
            >
              <h3 className={`
                text-sm font-medium text-gray-500 mb-0
                transition-all duration-300 ease-in-out
                ${showSidebar ? 'opacity-100' : 'opacity-0 hidden'}
              `}>
                Categories
              </h3>
              <svg 
                className={`ml-2 h-5 w-5 transform transition-transform duration-200 ${
                  expandedSections.categories ? 'rotate-180' : ''
                }`} 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            <div 
              id="categories-content"
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                expandedSections.categories ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <ul className="space-y-1 px-2">
              {categories.map((topic: Category) => (
                <li key={topic.topic}>
                  <a href="#"
                    className={`
                      flex items-center px-3 py-3 rounded-lg
                      hover:bg-gray-100 transition-all duration-200 ease-in-out
                      group relative cursor-pointer
                      ${activeSection === topic.topic ? 'bg-blue-50 border-r-2 border-blue-500' : ''}
                    `}
                    onClick={(e) => {
                      e.preventDefault();
                      handleTopicClick(topic.topic);
                    }}
                  >
                    <div className={`
                      flex items-center min-w-0 w-full cursor-pointer
                      ${!showSidebar ? 'justify-center' : 'space-x-3'} z-60
                    `}>
                      <CategoryIcons 
                        firstLetter={topic.topic.charAt(0)} 
                        active={activeSection === topic.topic} 
                      />
                      
                      <span className={`
                        text-gray-700 text-sm font-medium truncate
                        transition-all duration-300 ease-in-out cursor-pointer
                        ${showSidebar ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 absolute pointer-events-none'}
                      `}>
                        {topic.topic}
                      </span>
                      
                      {/* Tooltip for collapsed state */}
                      {!showSidebar && (
                        <div className="
                          absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg
                           group-hover:opacity-100 transition-opacity duration-200
                          pointer-events-none whitespace-nowrap z-50
                          transform translate-y-0 opacity-0
                        ">
                          {topic.topic}
                          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 
                                        border-4 border-transparent border-r-gray-900"></div>
                        </div>

                        // <div className="flex items-center absolute left-2 z-60">
                        //   <div className="h-4 w-4 border-y-8 border-l-0 border-r-8 border-solid border-gray-100 border-y-transparent z-60"></div>
                        //   <div className="flex h-10 items-center rounded-md bg-gray-100 px-4 font-medium z-60">
                        //       40K stars on GitHub
                        //   </div>
                        // </div>
                      )}
                    </div>
                  </a>
                </li>
              ))}
              </ul>
            </div>
          </nav>
        }
        <SideNavUserBadge 
          user={user} 
        />
      </div>
    </aside>
  )
}

export default SideNav