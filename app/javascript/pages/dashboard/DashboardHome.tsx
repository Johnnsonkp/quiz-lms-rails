import { Category } from "../../types/dashboard";
import { QuizPreview } from "../../types/dashboard";
import { memo } from "react";

type DashboardHomeProps = {
  quiz_preview: QuizPreview[];
  categories: Category[];
};

export const DashboardHome = memo(({ quiz_preview, categories }: DashboardHomeProps) => {
  return (
    <section className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-left !text-xl font-bold text-gray-800">Welcome Back!</h1>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Available Topics</h2>
          <p className="text-2xl font-bold text-green-600">{categories?.length}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Total Subjects</h2>
          <p className="text-2xl font-bold text-yellow-600">
            {quiz_preview?.length ?? 0}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Total Questions</h2>
          <p className="text-2xl font-bold text-blue-600">-</p>
        </div>
      </div>
    </section>
  );
});