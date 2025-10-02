import DashboardHeatmap from "../components/heatmap/DashboardHeatmap";
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
  console.log("user", user)
  return (
    <section className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-left !text-xl font-bold text-gray-800">Welcome Back! {user?.name || user?.email}</h1>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Available Topics</h2>
          <p className="text-2xl font-bold text-blue-600">{dashboard_stats?.total_topics ?? 0}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Total Subjects</h2>
          <p className="text-2xl font-bold text-blue-600">
            {dashboard_stats?.total_subjects ?? 0}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Total Questions</h2>
          <p className="text-2xl font-bold text-blue-600">{dashboard_stats?.total_questions ?? 0}</p>
        </div>

        <div className="flex justify-between bg-white p-4 rounded-lg shadow-md">
          <div className="w-15 h-15 bg-indigo-600 rounded-full flex items-center justify-center">
            <h3 className="text-white font-semibold text-2xl">
              {user && user?.name ? user.name[0] : ''}
            </h3>
          </div>
          <hr></hr>
          <div className="flex-col">
            <h2 className="text-sm font-semibold text-gray-700 pb-1">{user && user?.email}</h2>
            <h2 className="text-sm font-normal text-gray-700">Active Streak:</h2>
            <h2 className="text-sm font-normal text-gray-700">Level: 1</h2>
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