// import { QuizTopic, Subject } from '../../types/index';

// interface Props {
//   selectedTopicData: QuizTopic;
//   onSubjectClick: (subject: Subject) => void;
// }

import './singleCard.css';

// interface SubjectImage {
//   [key: string]: string;
// }

function SubjectCards({ titles, subject, onSubjectClick, subjectImg }: any) {

  return (
      <>
        <button
          key={subject}
          onClick={() => onSubjectClick(subject)}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-left w-full overflow-hidden !p-2 flex flex-col cursor-pointer"
        >
          <div className="card-image-container">
            {!subjectImg ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-4 border-b-2 border-blue-600"></div>
              </div>
            ) : subjectImg ? (
              <>
                <img
                  src={subjectImg}
                  alt={subject}
                  className="card-image"
                />
                <div className="image-overlay"></div>
                <div className="card-content">
                  <span className="text-white font-semibold text-lg">
                    {subject.trim().substring(0, 20)}
                  </span>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
                <span className="text-white font-semibold text-lg">
                  {subject.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-2 flex flex-col justify-between h-full">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">{subject}</h2>

            <div className="space-y-2">
              {titles.map((title: any, index: number) => (
                index < 3 && (
                  <div key={title} className="border-l-3 border-blue-500 pl-2">
                    <h3 className="text-sm font-medium text-gray-600">{title}</h3>
                  </div>
                )
              ))}
            </div>
            <div className="mt-2 pt-1 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-white-500">Total Questions:</span>
                {/* <span className="text-sm font-bold text-green-600">
                  {selectedTopicData.titles.reduce((total: number, concept: any) => total + concept.questions.length, 0)}
                  <span className="text-sm text-gray-500"> Questions</span>
                </span> */}
              </div>
            </div>
          </div>
        </button>
      {/* ))} */}
    </>
  )
}

export default SubjectCards