import { useEffect, useState } from 'react';
// import { QuizTopic, Subject } from '../../types/index';

// interface Props {
//   selectedTopicData: QuizTopic;
//   onSubjectClick: (subject: Subject) => void;
// }

// interface SubjectImage {
//   [key: string]: string;
// }

function SubjectCards({ selectedTopicData, onSubjectClick }: any) {
  const [subjectImages, setSubjectImages] = useState<any>({});
  const [loadingImages, setLoadingImages] = useState<boolean>(true);
  // const CLIENT_ID = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

  // async function getPicFromUnsplash(subject: string) {
  //   try {
  //     const response = await fetch(`https://api.unsplash.com/search/photos?page=1&query=${encodeURIComponent(subject)}&per_page=1`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Accept': 'application/json',
  //         'Accept-Version': 'v1',
  //         'Authorization': `Client-ID ${CLIENT_ID}`,
  //       },
  //       mode: 'cors'
  //     });
      
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }
      
  //     const data = await response.json();
  //     return data.results?.[0]?.urls?.small || null;
  //   } catch (error) {
  //     console.error('Error fetching image from Unsplash:', error);
  //     return null;
  //   }
  // }

  // useEffect(() => {
  //   const loadImages = async () => {
  //     setLoadingImages(true);
  //     const imagePromises = selectedTopicData.subjects.map(async (subject) => {
  //       const imageUrl = await getPicFromUnsplash(subject.subject);
  //       return { subject: subject.subject, imageUrl };
  //     });

  //     const imageResults = await Promise.all(imagePromises);
  //     const imageMap: SubjectImage = {};
      
  //     imageResults.forEach(({ subject, imageUrl }) => {
  //       if (imageUrl) {
  //         imageMap[subject] = imageUrl;
  //       }
  //     });

  //     setSubjectImages(imageMap);
  //     setLoadingImages(false);
  //   };

  //   console.log(CLIENT_ID);

  //   loadImages();
  // }, [selectedTopicData]);

  // const CompletionUI: any = () => {
  //    return <>
  //           <svg className="w-20 h-20 transform translate-x-1 translate-y-1" x-cloak aria-hidden="true">
  //             <circle
  //               className="text-gray-300"
  //               stroke-width="4"
  //               stroke="currentColor"
  //               fill="transparent"
  //               r="25"
  //               cx="30"
  //               cy="30"
  //               />
  //             <circle
  //               className="text-blue-600"
  //               stroke-width="4"
  //               stroke-dasharray="circumference"
  //               stroke-dashoffset="circumference - percent / 100 * circumference"
  //               stroke-linecap="round"
  //               stroke="currentColor"
  //               fill="transparent"
  //               r="25"
  //               cx="30"
  //               cy="30"
  //              />
  //           </svg>
  //           <span className="absolute text-2xl text-blue-700" x-text="`${percent}%`">Accuracy</span>
  //         </>
  // }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* {selectedTopicData.subjects.map((subject: any) => ( */}
        <button
          key={selectedTopicData.subject}
          onClick={() => onSubjectClick(selectedTopicData)}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-left w-full overflow-hidden !p-2 flex flex-col"
        >
          {/* Image Section */}
          <div className="h-25 bg-gray-200 relative">
            {loadingImages ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-4 border-b-2 border-blue-600"></div>
              </div>
            ) : subjectImages[selectedTopicData.subject] ? (
              <img
                src={subjectImages[selectedTopicData.subject]}
                alt={selectedTopicData.subject}
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
                <span className="text-white font-semibold text-lg">
                  {selectedTopicData.subject.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-2 flex flex-col justify-between h-full">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">{selectedTopicData.subject}</h2>
            {/* <div className='flex items-center justify-between'>
              <div className='flex align-middle items-center text-[#333]'>
                <CompletionUI /> <p>Accuracy</p>
              </div>
              <CompletionUI />
            </div> */}
            <div className="space-y-2">
              {selectedTopicData.concepts.map((concept: any, index: number) => (
                index < 3 && (
                  <div key={concept.concept} className="border-l-4 border-blue-500 pl-3">
                    <h3 className="text-sm font-medium text-gray-600">{concept.concept}</h3>
                    <p className="text-xs text-gray-500">
                      {concept.questions.length} question{concept.questions.length !== 1 ? 's' : ''} available
                    </p>
                  </div>
                )
              ))}
            </div>
            <div className="mt-4 pt-1 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-white-500">Total Questions:</span>
                <span className="text-sm font-bold text-green-600">
                  {selectedTopicData.concepts.reduce((total: number, concept: any) => total + concept.questions.length, 0)}
                  <span className="text-sm text-gray-500"> Questions</span>
                </span>
              </div>
            </div>
          </div>
        </button>
      {/* ))} */}
    </div>
  )
}

export default SubjectCards