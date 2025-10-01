import { QuizPreview } from "../../../types/dashboard"

function TableOfContents({ quiz_preview }: { quiz_preview: QuizPreview[] | null }) {
  return (
    // <div className="border-2 border-[#E5E7EB] rounded-md w-[230px] bg-[#F9FAFB] shadow-sm">
    <div className="border-2 border-[#E5E7EB] rounded-md w-full bg-[#F9FAFB] shadow-sm">
      <h3 className="font-semibold border-b border-[#F3F4F6] py-2 px-2">Table of Contents</h3>
      <ul className="flex flex-col gap-0 max-w-[280px] mx-auto mt-0 bg-white">

        {quiz_preview && quiz_preview.length > 0 && quiz_preview.map((quiz, index) => (
          <li key={index} className="border border-gray-200 transition-shadow duration-200 hover:bg-[#F3F4F6]">
            <details className="group">
              <summary className="text-[13px] flex items-center justify-between gap-2 p-2 font-medium marker:content-none hover:cursor-pointer">
                  <span className="flex gap-2">
                      <h3>{index + 1}.</h3>
                      <span>
                          {quiz.subject?.trim().substring(0, 40)}
                      </span>
                  </span>
                  <svg className="w-2 h-4 text-gray-500 transition group-open:rotate-90" xmlns="http://www.w3.org/2000/svg"
                      width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path fill-rule="evenodd"
                          d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z">
                      </path>
                  </svg>
              </summary>

              <article className="px-4 pb-4">
                  <ul className="flex flex-col gap-1 pl-2 ">
                    {quiz?.quiz_details?.map((detail, idx) => (
                      <div key={idx} className="flex items-center gap-1">
                        <span className="text-xs">{index + 1}.{idx + 1}.</span>
                        <li key={idx} className="cursor-pointer border-t py-1 border-gray-200 text-[12px] text-gray-600 hover:underline">
                          {detail?.title}
                        </li>
                      </div>
                      ))}
                  </ul>
              </article>

            </details>
          </li>

        ))}
      </ul>
    </div>
  )
}

export default TableOfContents