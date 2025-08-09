import React, { useEffect, useState } from 'react';

import SubjectCards from '../components/cards/SubjectCard';

function Dashboard({ categories, quizzes }: any) {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(false);
  const [quizTopics, setQuizTopics] = useState<any[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<any | null>(null);

  useEffect(() => {
    const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTopicClick = (topicName: string) => {
    if (topicName) {
      setSelectedTopic(topicName);
      setSelectedSubject(null);
    }
  };

  const handleSubjectClick = (subject: any) => {
    setSelectedSubject(subject);
    setActiveSection('quiz');
  };

  const handleBackToDashboard = () => {
    setSelectedSubject(null);
    setActiveSection(selectedTopic || 'dashboard');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full">

      <aside
        className={`bg-white shadow-lg transition-all duration-300 ease-in-out fixed md:static inset-y-0 left-0 z-50 ${
          openSidebar || !isMobile ? 'w-64' : 'w-0 hidden'
        }`}
      >
        <a href="/" className="p-4 flex items-center justify-between border-b">
          <h1
            className={`!text-lg font-bold text-gray-600 transition-opacity duration-300 ${
              openSidebar || !isMobile ? 'opacity-100 block' : 'opacity-0 hidden'
            }`}
          >
            LearnNest
          </h1>
          <button
            onClick={() => setOpenSidebar(!openSidebar)}
            className="md:hidden p-2 rounded-full hover:bg-gray-200 bg-red-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </a>

        <nav className="py-4">
          <ul className="space-y-2">
            
            {/* Quiz Topics Section */}
            <li className="pt-4">
              <ul className="space-y-2">
                {categories.map((topic: any) => (
                  <li key={topic}>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleTopicClick(topic)
                        setActiveSection(topic);
                        setOpenSidebar(false);
                      }}
                      className={`flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors ${
                        activeSection === topic ? 'bg-gray-100' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span
                          className={`text-gray-700 text-sm transition-opacity duration-300 ${
                            openSidebar || !isMobile ? 'block opacity-100' : 'hidden opacity-0'
                          }`}
                        >
                          {topic}
                        </span>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto border-2 w-[100%] bg-gray-100">
        {/* Mobile Header */}
        {isMobile && (
          <div className="md:hidden flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold text-gray-800">E-Commerce</h1>
            <button onClick={() => setOpenSidebar(!openSidebar)} className="p-2 rounded-full hover:bg-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        )}


        {/* Default Dashboard View */}
        {!selectedTopic && activeSection === 'dashboard' && (
          <section className="space-y-6">
            <header>
              <h1 className="text-left !text-lg font-bold text-gray-800">Welcome Back!</h1>
              <p className="text-left text-gray-600">Here's what's happening with your quiz journey today.</p>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-700">Available Topics</h2>
                <p className="text-2xl font-bold text-green-600">{quizTopics.length}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-700">Total Subjects</h2>
                <p className="text-2xl font-bold text-yellow-600">
                  {quizTopics.reduce((total, topic) => total + topic.subjects.length, 0)}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-700">Total Questions</h2>
                {/* <p className="text-2xl font-bold text-blue-600">
                  {quizTopics.reduce((total, topic) => 
                    total + topic.subjects.reduce((subTotal, subject) => 
                      subTotal + subject.concepts.reduce((conceptTotal, concept) => 
                        conceptTotal + concept.questions.length, 0), 0), 0)}
                </p> */}
              </div>
            </div>
          </section>
        )}


        {/* {selectedSubject && activeSection === 'quiz' && (
          <SingleQuestionComponent
            subject={selectedSubject}
            onBack={handleBackToDashboard}
          />
        )} */}


        {categories && categories[0] && (
          (() => {
            // const selectedTopicData = quizTopics.find(topic => topic.topic === selectedTopic);
            // if (!selectedTopicData) return null;
            
            return (
              <section className="space-y-6">
                <header>
                  <h1 className="text-left !text-lg font-bold text-gray-800">{selectedTopic}</h1>
                  {/* <h1 className="text-left !text-lg font-bold text-gray-800">{categories[0]}</h1> */}
                  <p className="text-left text-gray-600">Choose a subject to start practicing questions.</p>
                </header>

                {/* <SubjectCards 
                  selectedTopicData={selectedTopicData} 
                  onSubjectClick={handleSubjectClick}
                /> */}

                {quizzes && quizzes.map((quiz: any) => (
                    quiz.topic == selectedTopic && (
                      // <p>{quiz.subject}</p>
                      <SubjectCards 
                        selectedTopicData={quiz} 
                        onSubjectClick={handleSubjectClick}
                      />
                    )
                ))}
              </section>
            );
          })()
        )}

       </main>
      </div>
    )
}

export default Dashboard