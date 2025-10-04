import DashboardHeatmap from "../components/heatmap/DashboardHeatmap";
// import StudyHoursHeatmap from '../components/study-tracker/StudyHoursHeatmap';
import UserStatsCard from "../components/ui/UserStatsCard";
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
      <header className="flex justify-between items-center">
        <h1 className="text-left !text-xl font-bold text-gray-800">Welcome Back! {user?.name || user?.email}</h1>
      </header>

      <div className=" flex justify-between ">

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

      </div>

      <hr className="border-gray-200"></hr>
      <DashboardHeatmap 
        user={user}
        activityType="quiz"
      />

    </section>
  );
});