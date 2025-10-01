import React, { useCallback, useState } from 'react';

import { LoadingSpinner } from '../ui/LoadSpinner';
import { handleListFormSubmit } from '../../../services/formServices/handleListFormSubmit';

interface EditFormData {
  id: number | null;
  title: string;
  subject: string;
}
// Edit Form Modal Component
interface EditFormProps {
  isOpen: boolean;
  formData: EditFormData;
  setShowEditForm: (show: boolean) => void;
}

export const EditForm: React.FC<EditFormProps> = ({ isOpen, formData, setShowEditForm }) => {
  const {loading, updateQuizListItem} = handleListFormSubmit();

  const [localFormData, setLocalFormData] = useState({
    id: formData.id,
    title: formData.title,
    subject: formData.subject
  });

  React.useEffect(() => {
    if (isOpen) {
      setLocalFormData({
        id: formData.id,
        title: formData.title,
        subject: formData.subject
      });
    }
  }, [isOpen, formData]);

  const handleSubmit = () => {
    if (localFormData.title.trim() && localFormData.subject.trim()) {
      updateQuizListItem(localFormData)
      setShowEditForm(false);
    }
  };

  const closeEditForm = useCallback(() => {
    setShowEditForm(false);
  }, []);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.7)] bg-opacity-50`}>
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Update Quiz</h3>
          <button
            onClick={closeEditForm}
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
            onClick={closeEditForm}
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
