import './singleCard.css';

import React from 'react';
import { SubjectCardProps } from '../../../types/dashboard';
import { deleteQuizData } from '../../../api/quiz';
import { useExternalIDs } from '../../../hooks/useExternalIDs';

function SubjectCards(
  { 
    titles, 
    ids,
    subject, 
    onSubjectClick, 
    subjectImg, 
    tag, 
    topic,
    quiz_details,
    editStatus,
  }: SubjectCardProps) {

  const { externalIds } = useExternalIDs(quiz_details, topic);
  const [updatedSubject, setUpdatedSubject] = React.useState([]);
  const [updatedTopic, setUpdatedTopic] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const imgOverlaySelector = () => {
    let overLayClasses = ["image-overlay", "image-overlay-2", "image-overlay-3"];
    return overLayClasses[Math.floor(Math.random() * overLayClasses.length)];
  }
  const [showEditForm, setShowEditForm] = React.useState(false);


  const deleteConfirmation = (ids: (number | undefined)[] | null, e: React.MouseEvent<HTMLButtonElement, MouseEvent>): boolean => {
    e.preventDefault();
    return window.confirm("Are you sure you want to delete this quiz? This action cannot be undone.");
  }

  const handleDelete = (ids: (number | undefined)[] | null, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (deleteConfirmation(ids, e)) {
      e.stopPropagation();
      e.preventDefault();
      deleteQuizData(ids, e);
      window.location.reload();
    } else {
      setShowEditForm(false);
    }
  };

  // const deleteConfirmation = (ids: (number | undefined)[] | null, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  //   e.preventDefault();
  //   return window.confirm("Are you sure you want to delete this quiz? This action cannot be undone.") ? 
  //   handleDelete(ids, e) : setShowEditForm(false);
  // }

  const EditQuizCard: React.FC<{ subject: string | null; topic: string | null, show: boolean, ids: number[] }> = 
  ({ subject, topic, show, ids }) => {
    const [onSubjectChange, setOnSubjectChange] = React.useState(subject || '');
    const [onTopicChange, setOnTopicChange] = React.useState(topic || '');

    const UpdateQuizCardEdit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();
      setLoading(true);
      try {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        const response = await fetch(`/dashboard/update_quiz`, {   
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-Token': csrfToken || ''
          },
          body: JSON.stringify({
            subject: onSubjectChange,
            topic: onTopicChange,
            quiz_ids: ids
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data?.status === 200) {
          setTimeout(() => {
            setLoading(false);
            setUpdatedSubject(data.updated_subject)
            setUpdatedTopic(data.updated_topic)
            setShowEditForm(false);
          }, 1500)
        }
      } catch (error) {
        console.error("Error updating quiz:", error);
      }
    }

    const onCloseForm = () => {
      setShowEditForm(false);
    }

    return (
      <div className={`${show ? "fixed" : "hidden"} inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.6)] bg-opacity-50`}>
        <form className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-50">
          <h3 className='font-bold text-md'>Update Quiz Item</h3>
          <div className="p-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subject">
                Subject Name
              </label>
              <input
                type="text"
                id="subject"
                value={onSubjectChange}
                onChange={(e) => setOnSubjectChange(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder={`e.g., ${subject}`}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subject">
                  Topic name
                </label>
                <input
                  type="text"
                  id="topic"
                  value={onTopicChange}
                  onChange={(e) => setOnTopicChange(e.target.value)}
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter subject name"
                />
            </div>
        </div>

        
        <button 
          className="hover:bg-red-400 cursor-pointer relative bottom-50 left-90 bg-red-500 text-white rounded px-4 py-2" 
          onClick={() => onCloseForm()}>X</button>

        <div>
            <button 
            className='cursor-pointer hover:bg-blue-400 bg-blue-500 text-white rounded px-4 py-2 flex items-center justify-center min-w-[110px]' 
            onClick={(e) => UpdateQuizCardEdit(e)}
            disabled={loading}
            >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            ) : null}
            {loading ? 'Updating...' : 'Update Quiz'}
            </button>
        </div>

      </form>
      </div>
    )
  }

  return (
    <>
    <div className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col cursor-pointer w-full max-w-[240px]" 
      onClick={() => {
        const validIds = ids ? ids.filter((id): id is number => id !== undefined) : null;
        onSubjectClick(subject, externalIds, validIds, titles);
      }}
    >
    <div className=" bg-white rounded-xl overflow-hidden shadow-lg h-[100%] border border-gray-100 w-full max-w-[300px]">

    <div className="relative">
      {!subjectImg ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-4 border-b-2 border-blue-600"></div>
          </div>
        ) : subjectImg ? (
          <>
            <img
              src={subjectImg}
              alt={ subject ? subject : 'Quiz Image'}
              className="card-image !h-40 blur-[1px]"
            />
            <div className={imgOverlaySelector()}></div>
            <div className="card-content">
              <span style={{width: '100%'}} className="text-white font-semibold text-md">
                {subject && subject?.trim().substring(0, 14)}
              </span>
              <span style={{width: '100%'}} className="text-white font-semibold text-md">
                {subject && subject.length > 14 && subject.trim().substring(14, 30)}
              </span>
              <span style={{width: '100%'}} className="text-white font-semibold text-md">
                {subject && subject.length > 30 && subject.trim().substring(30, 46)}
              </span>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
            <span className="text-white font-semibold text-lg">
              {subject?.charAt(0)}
            </span>
          </div>
        )}
      <div className="absolute top-3 badge-flag-container">
        <div
          className="relative bg-white pl-1 pr-1 py-1 text-[8px] font-semibold text-gray-700 flex items-center gap-1 badge-flag shadow-sm z-20">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
            stroke="currentColor" className="w-5 h-4">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
          </svg>
          <div className='z-20 text-[0.83rem]'>Average Score: <span className='font-bold text-green-700'>90%</span></div>
        </div>
      </div>

      {editStatus && (
        <div className='rounded-lg bg-white h-[90px] w-[35px] absolute top-2 right-1 z-22'>
        {/* Edit Button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault()
              setShowEditForm(true)
            }}
            className="z-22 bg-white text-white w-7 border-2 border-blue-500 absolute top-2 right-1 flex items-center justify-center gap-1 cursor-pointer"
          >

            <svg className="w-5 h-5 text-blue-500" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.25 2.25 0 1 1 3.182 3.182l-11.25 11.25a2.25 2.25 0 0 1-1.012.573l-4.125 1.031a.375.375 0 0 1-.456-.456l1.03-4.125a2.25 2.25 0 0 1 .574-1.012l11.25-11.25z" />
            </svg>

          </button>
          
          <button
            // onClick={(e) => deleteConfirmation(ids, e)}
            onClick={(e) => handleDelete(ids, e) }
            className="absolute top-11 right-1 text-red-500 hover:text-red-700 z-22 cursor-pointer"
          >
            <svg className="w-7 h-7 bg-white rounded-full text-red-500 hover:bg-red-500 hover:text-white p-0 border border-red-500" 
          aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>
          </button>
        </div>
      )}

      </div>

    <div className="bg-cyan-50 text-cyan-700 px-4 py-1 text-xs font-semibold flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"
        className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
      <span>{tag || 'ADVANCED'}</span>
    </div>

    <div className="p-4">
      <div className='flex justify-between'>
        <div>
          <p className="text-[11px] text-gray-500 mb-2">{updatedTopic || topic}</p>
          <h3 className="text-base font-semibold text-gray-800 mb-3 leading-tight">
            {updatedSubject.length > 0 && updatedSubject?.slice(0, 15) || subject && subject?.slice(0, 15)}
            <span>{updatedSubject.length > 15 && updatedSubject?.slice(15, 30) || subject && subject?.slice(15, 30)}</span>
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
        {titles.length > 1? titles?.slice(0, 2).map((title: any, index: number) => (
          <div key={index} className="text-[11px] text-gray-600 border-l-2 border-blue-500 pl-2">
            {title}
          </div>
        )) : (
          <div className="text-[11px] text-gray-600 border-l-2 border-blue-500 pl-2">
            {titles}
          </div>)}
      </div>

      <div className="flex items-end justify-between text-sm text-gray-600 mb-0 mt-4">
        <div className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
            stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <span className='text-[11px]'>{titles ? `${titles.length} Quizzes` : 'N/A'}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
              stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
            </svg>
            <span className='text-[11px]'>39 Questions</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

    <EditQuizCard 
      subject={subject} 
      topic={topic} 
      show={showEditForm}
      ids={ids as number[]}
    />
  </>
  )
}

export default SubjectCards