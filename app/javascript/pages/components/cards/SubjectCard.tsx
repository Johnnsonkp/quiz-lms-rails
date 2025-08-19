// import { QuizTopic, Subject } from '../../types/index';

// interface Props {
//   selectedTopicData: QuizTopic;
//   onSubjectClick: (subject: Subject) => void;
// }

import './singleCard.css';

// interface SubjectImage {
//   [key: string]: string;
// }

function SubjectCards({ titles, subject, onSubjectClick, subjectImg, tag, description, topic }: any) {

  return (
    //   <>
    //     <button
    //       key={subject}
    //       onClick={() => onSubjectClick(subject)}
    //       className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-left w-full overflow-hidden !p-2 flex flex-col cursor-pointer"
    //     >
    //       <div className="card-image-container">
    //         {!subjectImg ? (
    //           <div className="h-full flex items-center justify-center">
    //             <div className="animate-spin rounded-full h-6 w-4 border-b-2 border-blue-600"></div>
    //           </div>
    //         ) : subjectImg ? (
    //           <>
    //             <img
    //               src={subjectImg}
    //               alt={subject}
    //               className="card-image"
    //             />
    //             <div className="image-overlay"></div>
    //             <div className="card-content">
    //               <span className="text-white font-semibold text-lg">
    //                 {subject.trim().substring(0, 20)}
    //               </span>
    //             </div>
    //           </>
    //         ) : (
    //           <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
    //             <span className="text-white font-semibold text-lg">
    //               {subject.charAt(0)}
    //             </span>
    //           </div>
    //         )}
    //       </div>

    //       {/* Content Section */}
    //       <div className="p-2 flex flex-col justify-between h-full">
    //         <h2 className="text-lg font-semibold text-gray-700 mb-2">{subject}</h2>

    //         <div className="space-y-2">
    //           {titles.map((title: any, index: number) => (
    //             index < 3 && (
    //               <div key={title} className="border-l-3 border-blue-500 pl-2">
    //                 <h3 className="text-sm font-medium text-gray-600">{title}</h3>
    //               </div>
    //             )
    //           ))}
    //         </div>
    //         <div className="mt-2 pt-1 border-t border-gray-200">
    //           <div className="flex justify-between items-center">
    //             <span className="text-sm text-white-500">Total Questions:</span>
    //             {/* <span className="text-sm font-bold text-green-600">
    //               {selectedTopicData.titles.reduce((total: number, concept: any) => total + concept.questions.length, 0)}
    //               <span className="text-sm text-gray-500"> Questions</span>
    //             </span> */}
    //           </div>
    //         </div>
    //       </div>
    //     </button>
    // </>

    // <>
    //   <div className="rounded overflow-hidden shadow-lg flex flex-col">
    //     <a href="#"></a>
        
    //     <div 
    //       onClick={() => onSubjectClick(subject)}
    //       className="relative"
    //     >
    //         <a href="#">
    //             {/* <img className="w-full"
    //                 src="https://images.pexels.com/photos/61180/pexels-photo-61180.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=1&amp;w=500"
    //                 alt="Sunset in the mountains" 
    //               /> */}


    //               {!subjectImg ? (
    //                   <div className="h-full flex items-center justify-center">
    //                     <div className="animate-spin rounded-full h-6 w-4 border-b-2 border-blue-600"></div>
    //                   </div>
    //                 ) : subjectImg ? (
    //                   <>
    //                     <img
    //                       src={subjectImg}
    //                       alt={subject}
    //                       className="w-full h-40"
    //                       // className="card-image"
    //                     />
    //                     <div className="image-overlay"></div>
    //                     <div className="card-content">
    //                       <span className="text-white font-semibold text-lg">
    //                         {/* {subject.trim().substring(0, 20)} */}
    //                       </span>
    //                     </div>
    //                   </>
    //                 ) : (
    //                   <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
    //                     <span className="text-white font-semibold text-lg">
    //                       {subject.charAt(0)}
    //                     </span>
    //                   </div>
    //                 )}


    //             <div
    //                 className="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25">
    //             </div>
    //         </a>
    //         <a href="#!">
    //           {/* {tags && tags.map((tag: string) => (
    //               <div className="z-30 text-xs absolute top-0 right-0 bg-indigo-600 px-4 py-2 text-white mt-3 mr-3 hover:bg-white hover:text-indigo-600 transition duration-500 ease-in-out">
    //                 {tag}
    //               </div>
    //           ))} */}
    //             <div className="z-30 text-xs absolute top-0 right-0 bg-indigo-600 px-4 py-2 text-white mt-3 mr-3 hover:bg-white hover:text-indigo-600 transition duration-500 ease-in-out">
    //                 {subject.trim().substring(0, 20)}
    //             </div>
    //         </a>
    //     </div>

    //     <div className="px-6 py-4 mb-auto">
    //         <a href="#" className="font-medium text-lg inline-block hover:text-indigo-600 transition duration-500 ease-in-out mb-2">
    //           {subject.trim().substring(0, 20)}
    //         </a>
    //              {/* {titles.map((title: any, index: number) => (
    //                 index < 3 && (
    //                     <a href="#" key={title} className="text-sm font-medium text-gray-600">{title}</a>
    //                 )
    //               ))} */}
    //         <p className="text-gray-500 text-sm">
    //             {/* Lorem Ipsum is simply dummy text of the printing and typesetting industry. */}
    //             {description}
    //         </p>
    //     </div>
    //     <div className="px-6 py-3 flex flex-row items-center justify-between bg-gray-100">
    //         <span  className="py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center">
    //             <svg height="13px" width="13px" version="1.1" id="Layer_1"
    //                 xmlns="http://www.w3.org/2000/svg" x="0px"
    //                 y="0px" viewBox="0 0 512 512" 
    //                 >
    //                 <g>
    //                     <g>
    //                         <path
    //                             d="M256,0C114.837,0,0,114.837,0,256s114.837,256,256,256s256-114.837,256-256S397.163,0,256,0z M277.333,256 c0,11.797-9.536,21.333-21.333,21.333h-85.333c-11.797,0-21.333-9.536-21.333-21.333s9.536-21.333,21.333-21.333h64v-128 c0-11.797,9.536-21.333,21.333-21.333s21.333,9.536,21.333,21.333V256z">
    //                         </path>
    //                     </g>
    //                 </g>
    //             </svg>
    //             <span className="ml-1">6 mins ago</span>
    //         </span>

    //         <span className="py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center">
    //             <svg className="h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
    //                     d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">
    //                 </path>
    //             </svg>
    //             <span className="ml-1">39 Questions</span>
    //         </span>
    //     </div>
    //   </div>
    // </>

    // <div className="border-2 border-red-500 p-10 flex justify-center items-center min-w-[350px] cursor-pointer" onClick={() => onSubjectClick(subject)}>
      <div className="bg-white rounded-xl overflow-hidden shadow-md flex flex-col cursor-pointer" onClick={() => onSubjectClick(subject)}>
  <div className=" bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">

    <div className="relative">
      {/* <img src="https://i0.wp.com/port2flavors.com/wp-content/uploads/2022/07/placeholder-614.png?w=1200&ssl=1" alt="Placeholder Course Image" className="w-full h-40 object-cover" /> */}
      {!subjectImg ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-4 border-b-2 border-blue-600"></div>
          </div>
        ) : subjectImg ? (
          <>
            <img
              src={subjectImg}
              alt={subject}
              className="card-image !h-40"
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
      <div className="absolute top-3 badge-flag-container">
        <div
          className="relative bg-white pl-3 pr-4 py-1 text-xs font-semibold text-gray-700 flex items-center gap-1 badge-flag shadow-sm z-20">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" className="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
          </svg>
          <div className='z-20'>CERTIFICATE</div>
        </div>
      </div>
    </div>

    <div className="bg-cyan-50 text-cyan-700 px-4 py-1 text-xs font-semibold flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
        className="w-4 h-4">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
      <span>{tag || 'BEGINNER'}</span>
    </div>

    <div className="p-4">
      <div className='flex justify-between'>
        <div>
          <p className="text-xs text-gray-500 mb-1">{topic}</p>
          <h3 className="text-base font-semibold text-gray-800 mb-3 leading-tight">
            {subject.slice(0, 15)}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Circular Progress Bar */}
          <div className="relative w-13 h-13">
            <svg className="w-13 h-13 transform -rotate-90" viewBox="0 0 32 32">
              {/* Background circle */}
              <circle
                cx="16"
                cy="16"
                r="14"
                stroke="currentColor"
                strokeWidth="3"
                fill="transparent"
                className="text-gray-200"
              />
              {/* Progress circle */}
              <circle
                cx="16"
                cy="16"
                r="14"
                stroke="currentColor"
                strokeWidth="3"
                fill="transparent"
                strokeDasharray={`${87.96 * 0.65} 87.96`} // 65% progress
                strokeLinecap="round"
                className="text-emerald-500"
              />
            </svg>
            {/* Progress percentage text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-semibold text-gray-700">65%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Display quiz titles */}
      <div className="space-y-1 mb-3">
        {titles && titles.slice(0, 2).map((title: any, index: number) => (
          <div key={index} className="text-xs text-gray-600 border-l-2 border-blue-500 pl-2">
            {title}
          </div>
        ))}
      </div>

      {/* Display description if provided */}
      {description && (
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">
          {description[0]}
        </p>
      )}

      <div className="flex items-center justify-between text-sm text-gray-600 mb-0 mt-4">
        <div className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" className="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <span className='text-xs'>{titles ? `${titles.length} Quizzes` : 'N/A'}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" className="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
            </svg>
            <span className='text-xs'>39 Questions</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  )
}

export default SubjectCards