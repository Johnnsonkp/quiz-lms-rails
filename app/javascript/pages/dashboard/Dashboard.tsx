import { DashboardProps, QuizPreview } from '../../types/dashboard';

import DashboardBanner from '../components/header/dashboardHeader/DashboardBanner';
import { DashboardHome } from './DashboardHome';
import Divider from '../components/divider/Divider';
import { Head } from '@inertiajs/react';
import QuizListPage from './QuizListPage';
import {SideButton} from '../components/buttons/SideButton';
import SideNav from '../components/aside/SideNav';
import SimpleLoadScreen from '../components/loading/SimpleLoadScreen';
import SingleQuestionComponent from '../components/cards/SingleQuestionComp';
import SubjectCards from '../components/cards/SubjectCard';
import TableOfContents from '../components/cards/TableOfContents';
import { getSelectedTopic } from '../../api/quiz';
import { handleURLParams } from '../../utils/urlParams';
import { slugify } from '../../utils/slugify';
import useInitialRouting from '../../hooks/useInitialRouting';
import { useQuizData } from '../../hooks/useQuizData';
import { useState } from 'react';

function Dashboard({ categories, dashboard_stats, url_params }: DashboardProps) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [quiz_preview, setQuizPreview] = useState<QuizPreview[] | null>([]);
  const [loadingQuizPreview, setLoadingQuizPreview] = useState(false);
  const { quizData, loading, error, fetchQuizData } = useQuizData();
  const [showSidebar, setShowSidebar] = useState(false);
  const [editStatus, setEditStatus] = useState(false);
  const [listTitles, setListTitles] = useState<string[] | null>(null);
  const [listSubject, setListSubject] = useState<string | null>(null);
  const [showQuizCards, setShowQuizCards] = useState(true);

  useInitialRouting({
    url_params,
    setSelectedTopic,
    setActiveSection,
    getSelectedTopic,
    setLoadingQuizPreview,
    setQuizPreview
  });

  const handleTopicClick = async (topicName: string) => {
    if (!topicName) return;

    setSelectedTopic(topicName);
    setActiveSection(topicName);
    setLoadingQuizPreview(true)
    setShowQuizCards(true);
    
    const data: any = await getSelectedTopic(topicName);
    if(data && data?.quiz_preview) {
      setQuizPreview(data?.quiz_preview);
      setLoadingQuizPreview(false)
      setListTitles(null);
      setListSubject(null);
    }
    window.history.pushState({}, '', `/dashboard/${slugify(topicName)}`);
  };

  const getQuizData = async (
    subject: string | null, 
    // externalIds: string[] | null,
    quizIds: number[] | number | null
  ) => {
    // if (!subject || !quizIds || !externalIds) return;
    if (!subject || !quizIds) return;
    
    // Normalize quizIds to always be an array
    const normalizedQuizIds = Array.isArray(quizIds) ? quizIds : [quizIds];
    // setEIDs(externalIds);
    setSelectedSubject(subject);
    setActiveSection('quiz');
    handleURLParams(subject, normalizedQuizIds, selectedTopic);
    await fetchQuizData(selectedTopic, subject, normalizedQuizIds);
  };


  const handleSubjectClick = async (
    subject: string | null, 
    externalIds: string[] | null, 
    quizIds: number[] | number | null,
    titles: string[] | null
  ) => {
    if (!subject || !quizIds || !externalIds || !titles) return;
    
    setListTitles(titles);
    setListSubject(subject);
    setShowQuizCards(false);
  };

  const handleBackToDashboard = () => {
    setSelectedSubject(null);
    setSelectedTopic(null);
    setActiveSection('dashboard');
  };


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

      <main 
        style={{ opacity: loading || loadingQuizPreview ? 0 : 1 }}
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

            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 mt-7 gap-y-8">
              {/* Subject Cards - take 3/4th space */}
              <div className="md:col-span-3 lg:col-span-3 flex flex-row flex-wrap gap-3">
                {showQuizCards && quiz_preview && quiz_preview
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
                    />
                  ))}
              </div>
              
              {/* Table of Contents - take 1/4th space, on right */}
              <div className="lg:col-span-1 fixed right-[25px]">
                {showQuizCards && quiz_preview && (
                  <TableOfContents quiz_preview={quiz_preview} />
                )}
              </div>
            </div>

            {showQuizCards == false && listTitles && listTitles?.length > 0 && listSubject &&
              <QuizListPage
                ids={quiz_preview?.find((q) => q.subject === listSubject)?.quiz_details?.map((d) => d.id).filter((id): id is number => typeof id === 'number') || []}
                titles={listTitles}
                subject={listSubject}
                img={quiz_preview?.find(q => q.subject === listSubject)?.img || null}
                getQuizData={getQuizData}
              />}

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