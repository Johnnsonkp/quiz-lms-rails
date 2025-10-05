import DashboardHeatmap from "../components/heatmap/DashboardHeatmap";
// import StudyHoursHeatmap from '../components/study-tracker/StudyHoursHeatmap';
// import UserStatsCard from "../components/ui/UserStatsCard";
import { memo } from "react";

type DashboardHomeProps = {
  dashboard_stats: {
    total_quizzes: number;
    total_questions: number;
    total_topics: number;
    total_subjects: number;
  };

  user: {
    id: number;
    email: string;
    name: string | null;
  } | any;
};

export const DashboardHome = memo(({ user, dashboard_stats }: DashboardHomeProps) => {
  return (
    <section className="space-y-6">
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 ">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
              <a href="#"
                  className="inline-block p-4 pb-[0.4rem] rounded-t-lg hover:text-gray-600 hover:border-gray-300 active border-b-2 text-black border-black-600">
                  Home
              </a>
          </li>
          <li className="mr-2">
              <a href="#" className="inline-block p-4 pb-[0.4rem] rounded-t-lg  "
                  aria-current="page">
                  Calendar
              </a>
          </li>
          <li className="mr-2">
              <a href="#"
                  className="inline-block p-4 pb-[0.4rem] border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 ">
                  Results
              </a>
          </li>
        </ul>
      </div>

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

          <div className="bg-white px-4 py-2 rounded-lg shadow-sm w-[140px]">
            <p className="text-2xl font-semibold text-blue-600">
              {dashboard_stats?.total_subjects ?? 0}
            </p>
            <h2 className="text-sm font-normal text-gray-700">Total Subjects</h2>
          </div>

          <div className="bg-white px-4 py-2 rounded-lg shadow-sm w-[140px]">
            <p className="text-2xl font-semibold text-blue-600">{dashboard_stats?.total_questions ?? 0}</p>
            <h2 className="text-sm font-normal text-gray-700">Total Questions</h2>
            {/* <p className="text-1xl font-bold text-blue-600">{dashboard_stats?.total_questions ?? 0}</p> */}
          </div>
        </div>
      </div>

      {/* <div className=" flex justify-between ">
        <div className="bg-white p-4 rounded-lg shadow-sm flex-[0.2]">
          <h2 className="text-lg font-semibold text-gray-700">Available Topics</h2>
          <p className="text-2xl font-bold text-blue-600">{dashboard_stats?.total_topics ?? 0}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm flex-[0.2]">
          <h2 className="text-lg font-semibold text-gray-700">Total Subjects</h2>
          <p className="text-2xl font-bold text-blue-600">
            {dashboard_stats?.total_subjects ?? 0}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm flex-[0.2]">
          <h2 className="text-lg font-semibold text-gray-700">Total Questions</h2>
          <p className="text-2xl font-bold text-blue-600">{dashboard_stats?.total_questions ?? 0}</p>
        </div>
        <UserStatsCard user={user} />
      </div> */}

      <hr className="border-gray-200"></hr>
      <DashboardHeatmap 
        user={user}
        activityType="quiz"
      />

    </section>
  );
});