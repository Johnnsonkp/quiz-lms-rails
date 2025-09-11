import { DashboardProps, QuizPreview } from '../../types/dashboard';
import { useEffect, useState } from 'react';
import {SideButton} from '../components/buttons/SideButton';

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
import { getSelectedTopic } from '../../api/quiz';
import { handleURLParams } from '../../utils/urlParams';

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

  const handleTopicClick = async (topicName: string) => {
    if (!topicName) return;

    setSelectedTopic(topicName);
    setActiveSection(topicName);
    setLoadingQuizPreview(true)
    const data: any = await getSelectedTopic(topicName);
    if(data && data?.quiz_preview) {
      setQuizPreview(data?.quiz_preview);
      setLoadingQuizPreview(false)
    }
    window.history.pushState({}, '', `/dashboard/${slugify(topicName)}`);
  };

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
    handleURLParams(subject, normalizedQuizIds, selectedTopic);
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
        setLoadingQuizPreview(true);
        const data: any = await getSelectedTopic(topicName);
        if(data && data?.quiz_preview) {
          setQuizPreview(data?.quiz_preview);
          setLoadingQuizPreview(false);
        }
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
      <SideButton showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

      <SideNav 
        categories={categories}
        handleTopicClick={handleTopicClick}
        activeSection={activeSection}
        showSidebar={showSidebar}
      />

      <main style={{ opacity: loading || loadingQuizPreview ? 0 : 1 }}
        className="flex-1 p-4 !pt-3 !mt-0 md:p-6 overflow-y-auto w-[100%] bg-[#F9FAFB] transition-opacity duration-300"
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
            handleBackToDashboard={handleBackToDashboard}
            selectedTopic={selectedTopic}
            categories={categories}
            titles={quiz_preview?.filter((quiz: QuizPreview) => quiz.topic?.toLowerCase() == selectedTopic?.toLowerCase()).flatMap((quiz) => quiz?.quiz_details?.map(detail => detail?.title).filter(Boolean) || [])}
          />

          <Divider />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-7 gap-y-8">
            {quiz_preview && quiz_preview
            .filter(
              (quiz: QuizPreview) =>
                quiz?.topic &&
                quiz.topic.toLowerCase() === selectedTopic.toLowerCase())
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
                />))}
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