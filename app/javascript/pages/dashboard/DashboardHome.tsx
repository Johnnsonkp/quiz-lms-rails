// import StudyHoursHeatmap from '../components/study-tracker/StudyHoursHeatmap';
// import UserStatsCard from "../components/ui/UserStatsCard";
import { memo, useEffect } from "react";

import DashboardHeatmap from "../components/heatmap/DashboardHeatmap";
import React from "react";
import TopNavSlideTabs from "../components/ui/TopNavSlideTabs";
import { UserI } from "../../types/userTypes";

type DashboardHomeProps = {
  dashboard_stats: {
    total_quizzes: number;
    total_questions: number;
    total_topics: number;
    total_subjects: number;
  };
  user: UserI | null;
  setSelectedSubject?: (subject: string | null) => void;
  setSelectedTopic?: (topic: string | null) => void;
  setActiveSection?: (section: string) => void;
};


export const DashboardHome = memo((
  { 
    user, 
    dashboard_stats, 
    setSelectedSubject, 
    setSelectedTopic, 
    setActiveSection,
  }: DashboardHomeProps) => {
  const [updateURL, setUpdateURL] = React.useState(true);

  useEffect(() => {
    if (updateURL == true) {
      // setSelectedSubject && setSelectedSubject(null);
      // setSelectedTopic && setSelectedTopic(null);
      // setActiveSection && setActiveSection('dashboard');
      window.history.replaceState(null, "", "/dashboard");
      setUpdateURL(false);
    }
  }, [window.location]);

  return (
    <section className="space-y-6">
      <TopNavSlideTabs />

      <div className="flex justify-between mt-3">
        <header className="flex-col justify-between items-start">
          <div className="w-[100%] flex">
            <h1 className="text-left !text-2xl font-semibold text-gray-800">Welcome Back! {user?.name || user?.email}</h1>
            <span role="img" aria-label="waving hand" className="ml-2 text-3xl">👋</span>
          </div>
          <p className="font-light text-sm pt-1 text-gray-600">Welcome to LMS, check your priority learning.</p>
        </header>

        <div className="flex justify-between gap-4 ">
          <div className="bg-white px-4 py-2 rounded-lg shadow-xs w-[140px] border-1 border-gray-200">
            <p className="text-2xl font-semibold text-blue-600">{dashboard_stats?.total_topics ?? 0}</p>
            <h2 className="text-sm font-normal text-gray-700">Topics</h2>
          </div>

          {/* <div className="bg-white px-4 py-2 rounded-lg shadow-sm w-[140px]"> */}
          <div className="bg-white px-4 py-2 rounded-lg shadow-xs w-[140px] border-1 border-gray-200">
            <p className="text-2xl font-semibold text-blue-600">
              {dashboard_stats?.total_subjects ?? 0}
            </p>
            <h2 className="text-sm font-normal text-gray-700">Total Subjects</h2>
          </div>

          {/* <div className="bg-white px-4 py-2 rounded-lg shadow-sm w-[140px]"> */}
          <div className="bg-white px-4 py-2 rounded-lg shadow-xs w-[140px] border-1 border-gray-200">
            <p className="text-2xl font-semibold text-blue-600">{dashboard_stats?.total_questions ?? 0}</p>
            <h2 className="text-sm font-normal text-gray-700">Total Questions</h2>
            {/* <p className="text-1xl font-bold text-blue-600">{dashboard_stats?.total_questions ?? 0}</p> */}
          </div>
        </div>
      </div>

      <hr className="border-gray-200"></hr>
      <DashboardHeatmap 
        user={user}
        activityType="quiz"
      />

    </section>
  );
});