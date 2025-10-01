import { Category } from '../../../types/dashboard';
import CategoryIcons from '../icons/CategoryIcons';
import Divider from '../divider/Divider';
import quizIcon from '../../../assets/quiz-icon.png'
import { useState, useEffect } from 'react';

function SideNav({categories, handleTopicClick, activeSection, showSidebar, quizData, selectedSubject}: 
  {
    categories: Category[];
    handleTopicClick: (topic: string) => void;
    activeSection: string;
    showSidebar: boolean;
    quizData: any;
    selectedSubject: any;
  }) {

  const [questions, setQuestions] = useState(quizData?.questions || []);

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

  return (
    <aside
      className={`md:fixed md:translate-x-0 
      fixed top-0 left-0 transition-transform duration-300 shadow-lg 
      h-screen w-64 z-30
      ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}
      style={{ background: '#fff', height: '100vh', overflowY: 'auto' }}
    >
      <a href="/" className="p-4 flex items-center justify-between">
        <h1 className={`!text-1xl font-bold text-black-500 transition-opacity duration-300`}>
          <img src={quizIcon} alt="Quiz Logo" className="w-8 h-8 inline-block ml-2" />
          QLearn
        </h1>
      </a>

      <Divider />
      
      {activeSection == "quiz" && questions ? 
        <nav className="py-4">
          <ul className="space-y-2">
            <li className="pt-1">
              <ul className="space-y-1 px-4">
                <h3 className='text-sm mb-2 text-gray-400'>{questions.length} questions</h3>
                {questions && questions.map((q: any, index: number) => (
                  <li key={index} className="relative">
                    <a href="#"
                      className={`flex mb-2 border-1 border-gray-200 items-center space-x-3 px-2 py-2 hover:bg-gray-100 rounded-lg transition-colors ${
                        activeSection === q?.question ? 'bg-gray-100' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        // handleTopicClick();
                      }}
                    >
                      <div className="flex items-start space-x-3 max-w-55">
                        {/* <CategoryIcons firstLetter={q?.question.charAt(0)} active={activeSection === q?.question} /> */}
                        <span className='text-sm'>{index + 1}</span>
                        <span className={`text-gray-700 text-sm transition-opacity duration-300 w-[100%] p-0`}>
                          {q?.question}
                        </span>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav> :

        <nav className="py-4">
          <ul className="space-y-2">
            <li className="pt-1">
              <ul className="space-y-1">
                {categories.map((topic: Category) => (
                  <li key={topic.topic} className="relative">
                    <a href="#"
                      className={`flex items-center space-x-3 px-5 py-2 hover:bg-gray-100 rounded-lg transition-colors ${
                        activeSection === topic.topic ? 'bg-gray-100' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleTopicClick(topic.topic);
                      }}
                    >
                      <div className="flex items-center space-x-3 max-w-55">
                        <CategoryIcons firstLetter={topic.topic.charAt(0)} active={activeSection === topic.topic} />
                        <span className={`text-gray-700 text-sm transition-opacity duration-300`}>
                          {topic.topic}
                        </span>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>

      }
      



    </aside>
  )
}

export default SideNav