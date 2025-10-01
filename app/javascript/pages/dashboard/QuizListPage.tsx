import React, { useCallback, useState } from 'react';

import { EditForm } from '../components/forms/EditListItemQuiz';
import {EditIcon} from '../components/ui/EditIcon';
import {deleteSingleQuizData} from '../../api/quiz';

// Types
interface Quiz {
  id: number;
  title: string;
}

interface QuizListPageProps {
  titles: string[] | null;
  subject: string | null;
  img: string | null;
  getQuizData?: (subject: string, id: number) => void;
  ids?: number[];
  quizList?: Quiz[] | any;
  showList?: boolean | false | undefined | any;
}

interface EditFormData {
  id: number | null;
  title: string;
  subject: string;
}

// Quiz List controllers TODO: Move to separate file
const handleGetQuizData = (getQuizData: any, subject: string | null, title: string, quizList: Quiz[]) => {
    if (!subject || !title || !quizList?.length) return;
    const quiz = quizList.find((q: Quiz) => q.title === title);
    if (!quiz?.id) return;
    getQuizData?.(subject, quiz.id);
};

const handleQuizEdit = (setEditFormData: any, setShowEditForm: any, title: string, subject: string | null, id: number | null) => {
    if (!id || !title || !subject) return;
    setEditFormData({id, title, subject});
    setShowEditForm(true);
};

const handleDelete = (id: number | undefined | null) => {
  if (window.confirm("Are you sure you want to delete this quiz? This action cannot be undone.")) {
    deleteSingleQuizData(id || null);
    window.location.reload();
  }
};



// Main Component
function QuizListPage({ titles, subject, img, getQuizData, quizList = [], showList }: QuizListPageProps) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [editFormData, setEditFormData] = useState<EditFormData>({id: null, title: '', subject: ''});

  // TODO: Move to separate file
  const getQuizId = useCallback((title: string): number | null => {
    const quiz = quizList?.find((q: Quiz) => q.title === title);
    return quiz?.id || null;
  }, [quizList]);

  const handleEditClick = useCallback((e: React.MouseEvent, title: string) => {
    e.stopPropagation();
    const id = getQuizId(title);
    if (id && subject) {
      handleQuizEdit(setEditFormData, setShowEditForm, title, subject, id);
    }
  }, [getQuizId, subject, handleQuizEdit]);

  if (showList && (!titles || titles.length === 0)) {
    return <div>No quizzes available</div>;
  }

  return (
    <div className={`${showList ? '' : 'hidden'}`}>
      <EditForm
        isOpen={showEditForm}
        setShowEditForm={setShowEditForm}
        formData={editFormData}
      />
      
      <table className="min-w-full divide-y divide-gray-200 overflow-x-auto border-2 border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-16 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              No.
            </th>
            <th className="w-[70%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quiz Titles
            </th>
            <th className="w-[10%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Note
            </th>
            <th className="w-[20%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {titles && titles.map((title, index) => (
            <tr
              key={`${title}-${index}`}
              onClick={() => handleGetQuizData(getQuizData, subject, title, quizList)}
              className="hover:bg-gray-100 cursor-pointer"
            >
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{index + 1}</div>
              </td>
              <td className="px-3 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={img || "https://i.pravatar.cc/150?img=1"}
                      alt=""
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {subject || 'General Knowledge'}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-3 py-4 whitespace-nowrap">
                {quizList?.find((q: Quiz) => q.title === title)?.note ? (
                    <button className="flex items-center gap-1 border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 hover:border-blue-500 transition-colors cursor-pointer">Note</button>
                  ) : (
                    <button className="text-gray-400 cursor-not-allowed text-sm" disabled>No Note</button>
                  )}
              </td>
              <td className="px-3 py-4 whitespace-nowrap">
                <div className="flex gap-2 items-center text-sm text-gray-500">
                  <button
                    onClick={(e) => handleEditClick(e, title)}
                    className="flex items-center gap-1 border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 hover:border-blue-500 transition-colors cursor-pointer"
                  >
                    <EditIcon />
                    Edit
                  </button>
                  <span className="text-gray-300">|</span>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(getQuizId(title))
                    }}
                    className="cursor-pointer text-red-600 hover:text-red-800 flex items-center gap-1 border border-gray-300 rounded-md px-2 py-1 text-sm hover:border-red-500 transition-colors">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default QuizListPage;