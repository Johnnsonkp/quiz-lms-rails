import React, { useCallback, useState } from 'react';

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

// Loading Spinner Component
const LoadingSpinner: React.FC = () => (
  <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
);

// Edit Form Modal Component
interface EditFormProps {
  isOpen: boolean;
  formData: EditFormData;
  onClose: () => void;
  onSubmit: (data: { title: string; subject: string }) => void;
  loading: boolean;
}

const EditForm: React.FC<EditFormProps> = ({ isOpen, formData, onClose, onSubmit, loading }) => {
  const [localFormData, setLocalFormData] = useState({
    title: formData.title,
    subject: formData.subject
  });

  React.useEffect(() => {
    if (isOpen) {
      setLocalFormData({
        title: formData.title,
        subject: formData.subject
      });
    }
  }, [isOpen, formData]);

  const handleSubmit = () => {
    if (localFormData.title.trim() && localFormData.subject.trim()) {
      onSubmit(localFormData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.7)] bg-opacity-50`}>
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Update Quiz</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Quiz Title
            </label>
            <input
              type="text"
              value={localFormData.title}
              onChange={(e) => setLocalFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter quiz title"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Subject Name
            </label>
            <input
              type="text"
              value={localFormData.subject}
              onChange={(e) => setLocalFormData(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter subject name"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center min-w-[100px] justify-center"
          >
            {loading ? (
              <>
                <LoadingSpinner />
                Updating...
              </>
            ) : (
              'Update'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Edit Icon Component
const EditIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M19 13.66V19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.34" />
    <path d="m17 1 4 4-10 10H7v-4z" />
  </svg>
);

// Main Component
function QuizListPage({ titles, subject, img, getQuizData, quizList = [], showList }: QuizListPageProps) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editFormData, setEditFormData] = useState<EditFormData>({id: null, title: '', subject: ''});

  const handleGetQuizData = useCallback((subject: string | null, title: string, quizList: Quiz[]) => {
    if (!subject || !title || !quizList?.length) return;
    
    const quiz = quizList.find((q: Quiz) => q.title === title);
    if (!quiz?.id) return;

    getQuizData?.(subject, quiz.id);
  }, [getQuizData]);

  const handleQuizEdit = useCallback((title: string, subject: string | null, id: number | null) => {
    if (!id || !title || !subject) return;
    
    setEditFormData({id, title, subject});
    setShowEditForm(true);
  }, []);

  const closeEditForm = useCallback(() => {
    setEditFormData({ id: null, title: '', subject: '' });
    setShowEditForm(false);
  }, []);

  const handleFormSubmit = useCallback(async (formData: { title: string; subject: string }) => {
    if (!editFormData.id) return;

    setLoading(true);
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      const response = await fetch('/dashboard/update_quiz_list', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-Token': csrfToken || ''
        },
        body: JSON.stringify({
          quiz_id: editFormData.id,
          quiz_title: formData.title,
          quiz_subject: formData.subject,
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data?.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating quiz:', error);
    } finally {
      setLoading(false);
      closeEditForm();
    }
  }, [editFormData.id, closeEditForm]);


  const deleteConfirmation = (): boolean => {
    return window.confirm("Are you sure you want to delete this quiz? This action cannot be undone.");
  }
  
  const handleDelete = (id: number | undefined | null) => {
    if (deleteConfirmation()) {
      deleteSingleQuizData(id || null);
      window.location.reload();
    } 
  };


  const getQuizId = useCallback((title: string): number | null => {
    const quiz = quizList?.find((q: Quiz) => q.title === title);
    return quiz?.id || null;
  }, [quizList]);

  const handleEditClick = useCallback((e: React.MouseEvent, title: string) => {
    e.stopPropagation();
    const id = getQuizId(title);
    if (id && subject) {
      handleQuizEdit(title, subject, id);
    }
  }, [getQuizId, subject, handleQuizEdit]);

  if (showList && (!titles || titles.length === 0)) {
    return <div>No quizzes available</div>;
  }

  return (
    <div className={`${showList ? '' : 'hidden'}`}>
      <EditForm
        isOpen={showEditForm}
        formData={editFormData}
        onClose={closeEditForm}
        onSubmit={handleFormSubmit}
        loading={loading}
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
              onClick={() => handleGetQuizData(subject, title, quizList)}
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