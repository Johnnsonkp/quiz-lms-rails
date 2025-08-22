import { useEffect, useState } from 'react';

import DashboardBanner from '../components/header/dashboardHeader/DashboardBanner';
import FileUpload from '../components/fileUpload/FileUpload';
import FileUploadButton from '../components/fileUpload/FileUploadButton';
import SingleQuestionComponent from '../components/cards/SingleQuestionComp';
// import QuizPage from './QuizPage';
// import SingleQuestionComponent from '../components/SingleQuestionComponent';
import SubjectCards from '../components/cards/SubjectCard';
// import quizIcon from '../../../assets/quiz-icon.png';
import quizIcon from '../../assets/quiz-icon.png'

function Dashboard({ categories, quiz_preview }: any) {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<any | null>(null);
  const [quizData, setQuizData] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    console.log("quiz_preview:", quiz_preview);
    
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
      setActiveSection(topicName);
    }
  };

  const handleSubjectClick = async (subject: any) => {
    console.log('Subject clicked:', subject);
    setSelectedSubject(subject);
    setActiveSection('quiz');

    try {
      const response = await fetch(`/dashboard/${selectedTopic}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Topic data:', data);
      setQuizData(data);
      console.log('Subject quizzes:', data);
      return data;
    } catch (error) {
      console.error('Error fetching topic data:', error);
      return null;
    }
  };

  const handleBackToDashboard = () => {
    setSelectedSubject(null);
    setSelectedTopic(null);
    setActiveSection('dashboard');
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
            <img src={quizIcon} alt="Quiz Logo" className="w-8 h-8 inline-block ml-2" />
            QLearn
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
                  <li key={topic.topic} className="relative">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleTopicClick(topic.topic);
                        setOpenSidebar(false);
                      }}
                      className={`flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors ${
                        activeSection === topic.topic ? 'bg-gray-100' : ''
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
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto  w-[100%] bg-gray-100">

        {/* Default Dashboard View */}
        {!selectedTopic && activeSection === 'dashboard' && (
          <section className="space-y-6">
            <header className='flex justify-between items-center'>
              <h1 className="text-left !text-xl font-bold text-gray-800">Welcome Back!</h1>
              {/* <p className="text-left text-gray-600">Here's what's happening with your quiz journey today.</p> */}

              <FileUploadButton setAction={() => setShowForm(!showForm)} />
              { showForm && <FileUpload /> }
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-700">Available Topics</h2>
                <p className="text-2xl font-bold text-green-600">{categories.length}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-700">Total Subjects</h2>
                <p className="text-2xl font-bold text-yellow-600">
                  {quiz_preview ? quiz_preview.length : 0}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-700">Total Questions</h2>
                <p className="text-2xl font-bold text-blue-600">-</p>
              </div>
            </div>
          </section>
        )}


        {/* Quiz View - Show quiz component for selected subject */}
        {selectedSubject && activeSection === 'quiz' && quizData && (
          <SingleQuestionComponent
            quizData={quizData}
            selectedSubject={selectedSubject}
            onBack={handleBackToDashboard}
          />
        )}

        {/* Topic View - Show subjects for selected topic */}
        {selectedTopic && activeSection === selectedTopic && (
          <section className="space-y-6">

            <DashboardBanner 
              handleBackToDashboard={handleBackToDashboard}
              selectedTopic={selectedTopic}
              categories={categories}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quiz_preview && quiz_preview.map((quiz: any, index: number) => (
                quiz.topic === selectedTopic &&
                <SubjectCards 
                    key={index}
                    titles={quiz.titles}
                    subject={quiz.subject}
                    description={quiz.description.filter((a: string) => a.includes(quiz.subject))}
                    topic={selectedTopic}
                    // difficulty={quiz.difficulty[index]}
                    tags={quiz.tags}
                    selectedTopicData={"test"}
                    subjectImg={quiz.img}
                    onSubjectClick={handleSubjectClick}
                />
              ))}
            </div>


            {quiz_preview && quiz_preview.filter((quiz: any) => quiz.topic === selectedTopic).length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No subjects available for this topic.</p>
              </div>
            )}
          </section>
        )}

       </main>
      </div>
    )
}

export default Dashboard