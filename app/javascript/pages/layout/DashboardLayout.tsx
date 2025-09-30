import BadgeCarousel from '../components/carousel/BadgeCarousel';
import DashboardBanner from '../components/header/dashboardHeader/DashboardBanner';
import { DashboardHome } from '../dashboard/DashboardHome';
import { DashboardLayoutProps } from '../../types/dashboard';
import Divider from '../components/divider/Divider';
import NoAvailableTopics from '../dashboard/NoAvailableTopics';
import QuizListPage from '../dashboard/QuizListPage';
import { QuizPreview } from '../../types/dashboard';
import { SideButton } from '../components/buttons/SideButton';
import SideNav from "../components/aside/SideNav";
import SimpleLoadScreen from '../components/loading/SimpleLoadScreen';
import SingleQuestionComponent from '../components/cards/SingleQuestionComp';
import SubjectCards from '../components/cards/SubjectCard';
import TableOfContents from '../components/cards/TableOfContents';
import { getSelectedTopic } from '../../api/quiz';
import { handleURLParams } from '../../utils/urlParams';
import { slugify } from '../../utils/slugify';
import useInitialRouting from '../../hooks/useInitialRouting';
import { usePage } from "@inertiajs/react"
import { useQuizData } from '../../hooks/useQuizData';
import { useState } from 'react';

function DashboardLayout({ children, user, categories, dashboard_stats, url_params }: DashboardLayoutProps) {
  // Get props from Inertia if not passed directly
  const pageProps = usePage().props;
  const finalUser = user || pageProps.user;
  const finalCategories = categories || pageProps.categories;
  const finalDashboardStats = dashboard_stats || pageProps.dashboard_stats;
  const finalUrlParams = url_params || pageProps.url_params;

  // All state management
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

  // Initial routing hook
  useInitialRouting({
    url_params: finalUrlParams,
    setSelectedTopic,
    setActiveSection,
    getSelectedTopic,
    setLoadingQuizPreview,
    setQuizPreview
  });

  // All handlers
  const handleTopicClick = async (topicName: string) => {
    if (!topicName) return;

    setSelectedTopic(topicName);
    setActiveSection(topicName);
    setLoadingQuizPreview(true);
    setShowQuizCards(true);
    
    const data: any = await getSelectedTopic(topicName);
    if(data && data?.quiz_preview) {
      setQuizPreview(data?.quiz_preview);
      setLoadingQuizPreview(false);
      setListTitles(null);
      setListSubject(null);
    }
    window.history.pushState({}, '', `/dashboard/${slugify(topicName)}`);
  };

  const getQuizData = async (
    subject: string | null, 
    quizIds: number[] | number | null
  ) => {
    if (!subject || !quizIds) return;
    
    const normalizedQuizIds = Array.isArray(quizIds) ? quizIds : [quizIds];
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

  // Content renderer based on state
  const renderContent = () => {
    if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

    // Dashboard Home
    if (!selectedTopic && activeSection === 'dashboard') {
      return <DashboardHome user={finalUser} dashboard_stats={finalDashboardStats} />;
    }

    // Loading states
    if (loading || loadingQuizPreview) return <SimpleLoadScreen />;

    // Quiz View - Show quiz component for selected subject
    if (selectedSubject && activeSection === 'quiz' && quizData && !loading) {
      return (
        <SingleQuestionComponent
          quizData={quizData}
          selectedSubject={selectedSubject}
          onBack={handleBackToDashboard}
          quizTitle={quizData?.quiz_title || ''}
        />
      );
    }

    // Topic View - Show subjects for selected topic
    if (selectedTopic && activeSection === selectedTopic) {
      return (
        <section className="space-y-2">
          <DashboardBanner
            setEditStatus={setEditStatus}
            handleBackToDashboard={handleBackToDashboard}
            selectedTopic={selectedTopic}
            categories={finalCategories}
            titles={
              quiz_preview?.filter((quiz: QuizPreview) => 
                quiz.topic?.toLowerCase() == selectedTopic?.toLowerCase()).flatMap((quiz) => 
                  quiz?.quiz_details?.map(detail => detail?.title).filter(Boolean) || [])
            }
          />

          <Divider />
          
          {showQuizCards == true &&
            <BadgeCarousel 
              quiz_preview={quiz_preview}
              selectedTopic={selectedTopic}
            />}

          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 mt-3 gap-y-8">
            <div className="md:col-span-3 lg:col-span-3 flex flex-row flex-wrap gap-4">
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

            {showQuizCards == true &&
              <div className="lg:col-span-1 fixed right-[25px] border-gray-300 border-2 w-[250px] rounded-md">
                {showQuizCards && quiz_preview && (<TableOfContents quiz_preview={quiz_preview} />)}
              </div>}
          </div>

          <QuizListPage
            ids={quiz_preview?.find((q) => q.subject === listSubject)?.quiz_details?.map((d) => d.id).filter((id): id is number => typeof id === 'number') || []}
            quizList={quiz_preview?.find((q) => q.subject === listSubject)?.quiz_details }
            titles={listTitles}
            subject={listSubject}
            img={quiz_preview?.find(q => q.subject === listSubject)?.img || null}
            getQuizData={getQuizData}
            showList={showQuizCards == false && listTitles && listTitles?.length > 0}
          />

          <NoAvailableTopics 
            quiz_preview={quiz_preview || []} 
            selectedTopic={selectedTopic} 
          />
        </section>
      );
    }

    return children || <DashboardHome dashboard_stats={finalDashboardStats} user={finalUser} />;
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full overflow-y-hidden bg-[#F9FAFB]">
      <SideButton showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

      <div className='flex-[0.23]'>
        <SideNav 
          categories={finalCategories}
          handleTopicClick={handleTopicClick}
          activeSection={activeSection}
          showSidebar={showSidebar}
          quizData={quizData}
          selectedSubject={selectedSubject}
        />
      </div>

      <main 
        style={{ opacity: loading || loadingQuizPreview ? 0 : 1 }}
        className="flex-[1] p-4 !pt-3 !mt-0 md:p-6 overflow-y-auto w-[100%] bg-[#F9FAFB] transition-opacity duration-300"
      >
        {renderContent()}
      </main>
    </div>
  );
}

export default DashboardLayout