import { QuizPreview } from '../../../types/dashboard';
import React from 'react'

function BadgeCarousel({selectedTopic, quiz_preview}: 
  {
    selectedTopic: string | null, 
    quiz_preview: QuizPreview[] | null
  }) {

  const [startIndex, setStartIndex] = React.useState(0);
  const titles = quiz_preview?.filter((quiz: QuizPreview) => quiz.topic?.toLowerCase() == selectedTopic?.toLowerCase()).flatMap((quiz) => quiz?.quiz_details?.map((detail: any) => detail?.title).filter(Boolean) || []) || null
  
  return (
    <div className="flex items-center pt-2 w-full mb-6">
      {titles && titles?.length > 1? (
        <>
          <button
            className="p-0 px-3 rounded-sm bg-gray-200 hover:bg-gray-300 text-gray-900 mr-[2px] disabled:opacity-50 cursor-pointer border-1 border-gray-500"
            onClick={() => setStartIndex((prev: number) => Math.max(prev - 1, 0))}
            disabled={startIndex === 0}
            aria-label="Previous"
            type="button"
          >
            &#8592;
          </button>
          <button
            className="p-0 px-3 rounded-sm bg-gray-200 hover:bg-gray-300 text-gray-900 ml-[2px] disabled:opacity-50 cursor-pointer border-1 border-gray-500"
            onClick={() => setStartIndex((prev: number) => Math.min(prev + 1, Math.max(0, titles.filter(Boolean).length - 4)))}
            disabled={titles && startIndex + 4 >= titles.filter(Boolean).length}
            aria-label="Next"
            type="button"
          >
            &#8594;
          </button>

        <div className="flex flex-wrap gap-2 flex-1 mx-4">
          {titles && titles
            .filter(Boolean)
            .slice(startIndex, startIndex + 4)
            .map((title: string, index: number) => (

            <span key={startIndex + index}
              className="inline-block bg-gray-200 rounded-full px-2 py-1 text-[13px] font-medium text-gray-800 cursor-pointer border-1 border-transparent hover:border-blue-500"
            >
              {title}
            </span>))}
        </div>

      </>) : 
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-[13px] font-medium text-gray-800 cursor-pointer border-1 border-transparent hover:border-blue-500">
            {titles}
          </span>
      }
    </div>
  )
}

export default BadgeCarousel