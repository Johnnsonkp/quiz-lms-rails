import { DashboardProps, QuizPreview } from '../../types/dashboard';
import { useEffect, useState } from 'react';

import DashboardBanner from '../components/header/dashboardHeader/DashboardBanner';
import { DashboardHome } from './DashboardHome';
import Divider from '../components/divider/Divider';
import { Head } from '@inertiajs/react';
import SideNav from '../components/aside/SideNav';
import SimpleLoadScreen from '../components/loading/SimpleLoadScreen';
import SingleQuestionComponent from '../components/cards/SingleQuestionComp';
import SubjectCards from '../components/cards/SubjectCard';
import { slugify } from '../../utils/slugify';
import { useQuizData } from '../../hooks/useQuizData';

function Dashboard({ categories, dashboard_stats, url_params }: DashboardProps) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [eIDs, setEIDs] = useState<string[] | null>(null);
  const { quizData, loading, error, fetchQuizData } = useQuizData();
  const [quiz_preview, setQuizPreview] = useState<QuizPreview[] | null>([]);
  const [loadingQuizPreview, setLoadingQuizPreview] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [editStatus, setEditStatus] = useState(false);

  const getSelectedTopic = async (topic: string) => {
    setLoadingQuizPreview(true);

    try {
      const response = await fetch(`/dashboard/${encodeURIComponent(topic)}/get`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setQuizPreview(data.quiz_preview);
      
    } catch (error) {
      console.error("Error fetching topic data:", error);
      setQuizPreview([]);
    } finally {
      setLoadingQuizPreview(false);
    }
  }

  const deleteQuizData = async (
    ids: (number | undefined)[] | null,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (!ids || ids.length === 0) return;

    // Filter out undefined and convert to string
    const quizIds = ids.filter((id): id is number => id !== undefined);
    if (quizIds.length === 0) return;
    console.log("Deleting quiz with IDs:", quizIds);

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      const response = await fetch(`/dashboard/delete_quiz`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-Token': csrfToken || ''
        },
        body: JSON.stringify({ quiz_ids: quizIds }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Quiz deleted successfully:", data);

      setSelectedSubject(null);
      setSelectedTopic(null);
      setActiveSection('dashboard');

    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  }

  const handleTopicClick = (topicName: string) => {
    if (!topicName) return;

    setSelectedTopic(topicName);
    setActiveSection(topicName);
    getSelectedTopic(topicName);
    window.history.pushState({}, '', `/dashboard/${slugify(topicName)}`);
  };

  const handleURLParams = (subject: string | null, quizIds: number[] | null) => {
    if(!subject && !quizIds) return;
    const url = new URL(window.location.origin);
    url.pathname = '/dashboard';
    url.searchParams.set('topic', selectedTopic || '');
    url.searchParams.set('subject', subject || '');
    url.searchParams.set('quiz_ids', quizIds ? quizIds.join(',') : '');
    window.history.pushState({}, '', url);
  }

  const handleSubjectClick = async (
    subject: string | null, 
    externalIds: string[] | null, 
    quizIds: number[] | number | null
  ) => {
    if (!subject || !quizIds || !externalIds) return;
    console.log('External IDs:', externalIds);
    console.log('eIDs:', eIDs);
    
    // Normalize quizIds to always be an array
    const normalizedQuizIds = Array.isArray(quizIds) ? quizIds : [quizIds];
    
    setEIDs(externalIds);
    setSelectedSubject(subject);
    setActiveSection('quiz');
    handleURLParams(subject, normalizedQuizIds);
    await fetchQuizData(selectedTopic, subject, normalizedQuizIds);
  };

  const handleBackToDashboard = () => {
    setSelectedSubject(null);
    setSelectedTopic(null);
    setActiveSection('dashboard');
  };

  // Handle page refresh and initial URL routing
  useEffect(() => {
    const handleInitialRouting = async () => {
      if (!url_params || url_params === '/dashboard') return;
      
      try {
        const topicName = url_params
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (char: string) => char.toUpperCase());
        
        console.log("Initializing topic from URL:", topicName);
        setSelectedTopic(topicName);
        setActiveSection(topicName);
        
        // Fetch topic data
        await getSelectedTopic(topicName);
      } catch (error) {
        console.error("Error during page refresh routing:", error);
        setSelectedTopic(null);
        setActiveSection('dashboard');
      }
    };
    handleInitialRouting();
  }, [url_params])

  if(error){ return <div className="text-center py-8 text-red-500">{error}</div>}

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full">
      <Head title="QLearn.ai" />

      {/* Sidebar Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-40 bg-white border rounded p-2 shadow"
        onClick={() => setShowSidebar((prev) => !prev)}
        aria-label="Toggle sidebar"
      >
        {showSidebar ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* SideNav with toggle */}
      <div className={`md:static md:translate-x-0 md:block
        fixed top-0 left-0 h-full transition-transform duration-300 shadow-lg
        ${showSidebar ? 'translate-x-0' : '-translate-x-full'} w-64 z-30 h-full`}
        style={{ background: '#fff', height: '100vh' }}
      >
        <SideNav 
          categories={categories}
          handleTopicClick={handleTopicClick}
          activeSection={activeSection}
        />
      </div>

      <main
      className="flex-1 p-4 !pt-3 !mt-0 md:p-6 overflow-y-auto w-[100%] bg-[#F9FAFB] transition-opacity duration-300"
      style={{ opacity: loading || loadingQuizPreview ? 0 : 1 }}
      >
      {!selectedTopic && activeSection === 'dashboard' && (
        <DashboardHome dashboard_stats={dashboard_stats}/>)}

      {/* Quiz View - Show quiz component for selected subject */}
      {loading && <SimpleLoadScreen />}
      {loadingQuizPreview && <SimpleLoadScreen />}

      {selectedSubject && activeSection === 'quiz' && quizData && !loading &&(
        <SingleQuestionComponent
          quizData={quizData}
          selectedSubject={selectedSubject}
          onBack={handleBackToDashboard}
        /> )}

      {/* Topic View - Show subjects for selected topic */}
      {selectedTopic && activeSection === selectedTopic && (
        <section className="space-y-2">
        <DashboardBanner
          setEditStatus={setEditStatus}
          deleteQuizData={deleteQuizData}
          handleBackToDashboard={handleBackToDashboard}
          selectedTopic={selectedTopic}
          categories={categories}
          titles={quiz_preview?.filter((quiz: QuizPreview) => quiz.topic?.toLowerCase() == selectedTopic?.toLowerCase()).flatMap((quiz) => quiz?.quiz_details?.map(detail => detail?.title).filter(Boolean) || [])}
        />

        <Divider />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-7 gap-y-8">
          {quiz_preview &&
          quiz_preview
            .filter(
            (quiz: QuizPreview) =>
              quiz?.topic &&
              quiz.topic.toLowerCase() === selectedTopic.toLowerCase()
            )
            .map((quiz: QuizPreview, index: number) => (
              <SubjectCards
                key={index}
                ids={quiz.quiz_details?.map((detail) => detail?.id) || null}
                titles={quiz.quiz_details?.filter((a) => a.title)?.map((a) => a.title) || []}
                subject={quiz.subject}
                description={quiz?.quiz_details?.[0]?.description || null}
                topic={quiz.topic}
                tag={quiz.tag || null}
                quiz_details={quiz.quiz_details || null}
                subjectImg={quiz.img}
                onSubjectClick={handleSubjectClick}
                editStatus={editStatus}
                deleteQuizData={deleteQuizData}
              />
            ))}
        </div>

        {quiz_preview && quiz_preview.filter((quiz: QuizPreview) => quiz.topic === selectedTopic).length === 0 && (
          <div className="text-center py-8">
          <p className="text-gray-500">No subjects available for this topic.</p>
          </div>)}
        </section>)}
      </main>
    </div>
  )
}

export default Dashboard