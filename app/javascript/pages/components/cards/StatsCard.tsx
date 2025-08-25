import { Category, QuizPreview } from "../../../types/dashboard"

function StatsCard({quiz_preview, categories }: 
  {
    quiz_preview: QuizPreview[], 
    categories: Category[] 
  }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-700">Available Topics</h2>
        <p className="text-2xl font-bold text-green-600">{categories.length}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-700">Total Subjects</h2>
        <p className="text-2xl font-bold text-yellow-600">
          {quiz_preview ? quiz_preview.length : 0}
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-700">Total Questions</h2>
        <p className="text-2xl font-bold text-blue-600">-</p>
      </div>
    </div>
  )
}

export default StatsCard