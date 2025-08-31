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

function Dashboard({ categories, quiz_preview }: DashboardProps) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [eIDs, setEIDs] = useState<string[] | null>(null);
  const { quizData, loading, error, fetchQuizData } = useQuizData();

  const handleTopicClick = (topicName: string) => {
    if (!topicName) return;

    console.log("topicName:", topicName);
    setSelectedTopic(topicName);
    setSelectedSubject(null);
    setActiveSection(topicName);
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
    quizIds: number[] | null
  ) => {
    if (!subject || !quizIds || !externalIds) return;

    console.log('External IDs:', externalIds);
    console.log("subject:", subject);
    console.log("quizIds:", quizIds);
    
    setEIDs(externalIds);
    setSelectedSubject(subject);
    setActiveSection('quiz');
    handleURLParams(subject, quizIds)
    await fetchQuizData(selectedTopic, subject, quizIds);
  };

  const handleBackToDashboard = () => {
    setSelectedSubject(null);
    setSelectedTopic(null);
    setActiveSection('dashboard');
  };

  // useEffect to get all pathnames in the URL
  useEffect(() => {
    const handleURLRouting = async () => {
      const pathname = window.location.pathname;
      const search = window.location.search;
      const pathSegments = pathname.split('/').filter(segment => segment !== '');
      // Check if this is a search route (has query parameters) or path route
      const isSearchRoute = search.length > 0;
      const isPathRoute = pathSegments.length > 1;

      if (isSearchRoute) {
        const urlParams = new URLSearchParams(search);
        const subject = urlParams.get('subject'); // "Algorithm Design and Implementation" 
        const quizIds = urlParams.get('quiz_ids'); // "43"
        const quizIdsArray = quizIds ? quizIds.split(',').map(id => parseInt(id)) : null;
        await handleSubjectClick(subject, eIDs, quizIdsArray);
        
      } else if (isPathRoute && pathSegments.length >= 2) {
        const topicSegment = pathSegments[1];
        const topicName = topicSegment.split('-').join(' ');
        handleTopicClick(topicName);
      }
    };
    handleURLRouting();
  }, []);

  if(error){ return <div className="text-center py-8 text-red-500">{error}</div>}

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full">
      <Head title="QLearn.ai" />
      <SideNav 
        categories={categories}
        handleTopicClick={handleTopicClick}
        activeSection={activeSection}
      />

      <main className="flex-1 p-4 !pt-3 !mt-0 md:p-6 overflow-y-auto w-[100%] bg-[#F9FAFB]">
        {!selectedTopic && activeSection === 'dashboard' && (
          <DashboardHome 
            quiz_preview={quiz_preview}
            categories={categories}
          />)}

        {/* Quiz View - Show quiz component for selected subject */}
        {loading && <SimpleLoadScreen />}
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
              handleBackToDashboard={handleBackToDashboard}
              selectedTopic={selectedTopic}
              categories={categories}
              titles={quiz_preview.filter((quiz: QuizPreview) => quiz.topic == selectedTopic).flatMap(quiz => quiz.titles)}
            />

            <Divider />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
              {quiz_preview && quiz_preview.map((quiz: QuizPreview, index: number) => (
                quiz.topic.toLowerCase() === selectedTopic.toLowerCase() &&
                <SubjectCards 
                  key={index}
                  ids={quiz?.ids || null}
                  titles={quiz.titles}
                  subject={quiz.subject}
                  description={quiz.description.filter((a: string) => a.includes(quiz.subject))}
                  topic={selectedTopic}
                  tag={quiz?.tag || null}
                  quiz_details={quiz.quiz_details || null}
                  subjectImg={quiz.img}
                  onSubjectClick={handleSubjectClick}
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