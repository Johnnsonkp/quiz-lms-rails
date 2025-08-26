import { DashboardProps, QuizPreview } from '../../types/dashboard';

import DashboardBanner from '../components/header/dashboardHeader/DashboardBanner';
import { Head } from '@inertiajs/react';
import SideNav from '../components/aside/SideNav';
import SingleQuestionComponent from '../components/cards/SingleQuestionComp';
import StatsCard from '../components/cards/StatsCard';
import SubjectCards from '../components/cards/SubjectCard';
import { slugify } from '../../utils/slugify';
import { useState } from 'react';

function Dashboard({ categories, quiz_preview }: DashboardProps) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<any | null>(null);
  const [quizData, setQuizData] = useState<any>(null);


  const handleTopicClick = (topicName: string) => {
    if (topicName) {
      setSelectedTopic(topicName);
      setSelectedSubject(null);
      setActiveSection(topicName);
      

      window.history.pushState({}, '', `/dashboard/${slugify(topicName)}`);
    }
  };

  const handleURLParams = (subject: string | null, quizIds: number[] | null) => {
    const url = new URL(window.location.origin);
    url.pathname = '/dashboard';
    url.searchParams.set('topic', selectedTopic || '');
    url.searchParams.set('subject', subject || '');
    url.searchParams.set('quiz_ids', quizIds ? quizIds.join(',') : '');
    console.log(url);

    if(subject && quizIds){
      window.history.pushState({}, '', url);
    }
  }

  const handleSubjectClick = async (subject: string, externalIds: string[] | null, quizIds: number[] | null) => {
    console.log('External IDs:', externalIds);

    setSelectedSubject(subject);
    setActiveSection('quiz');
    handleURLParams(subject, quizIds)

    try {
      const response = await fetch(`/dashboard/${selectedTopic}/${subject}/${quizIds}`, {
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
      setQuizData(data);
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
      <Head title="QLearn.ai" />
      <SideNav 
        categories={categories}
        handleTopicClick={handleTopicClick}
        activeSection={activeSection}
      />

      {/* Main Content */}
      <main className="flex-1 p-4 !pt-3 !mt-0 md:p-6 overflow-y-auto w-[100%] bg-[#F9FAFB]">
        {/* Default Dashboard View */}
        {!selectedTopic && activeSection === 'dashboard' && (
          <section className="space-y-6 ">
            <header className='flex justify-between items-center'>
              <h1 className="text-left !text-xl font-bold text-gray-800">Welcome Back!</h1>
            </header>
            <StatsCard quiz_preview={quiz_preview} categories={categories} />
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
          <section className="space-y-2">
            <DashboardBanner 
              handleBackToDashboard={handleBackToDashboard}
              selectedTopic={selectedTopic}
              categories={categories}
            />

            <hr className='bg-gray-500 border-t border-gray-300'></hr>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-7">
              {quiz_preview && quiz_preview.map((quiz: QuizPreview, index: number) => (
                quiz.topic === selectedTopic &&
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