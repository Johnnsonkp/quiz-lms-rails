import React, { useEffect, useState } from 'react';

import { EditQuizQuestionFormProps } from '../../../types/dashboard';
import Toast from '../ui/Toast';

const EditQuizQuestionForm: React.FC<EditQuizQuestionFormProps> = ({
  question,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    question_id: question.id,
    question: question.question,
    answer: question.answer,
    incorrect_answers: question.incorrect_answers || []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false
  });

  // Update form data when question prop changes
  useEffect(() => {
    setFormData({
      question_id: question.id,
      question: question.question,
      answer: question.answer,
      incorrect_answers: question.incorrect_answers || []
    });
    setErrors([]);
  }, [question]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleIncorrectAnswerChange = (index: number, value: string) => {
    if (!formData.incorrect_answers || index < 0 || index >= formData.incorrect_answers.length) {
      return;
    }
    
    const newIncorrectAnswers = [...formData.incorrect_answers];
    newIncorrectAnswers[index] = value;
    setFormData(prev => ({
      ...prev,
      incorrect_answers: newIncorrectAnswers
    }));
  };

  const addIncorrectAnswer = () => {
    // Guard clause: ensure incorrect_answers exists and hasn't reached max limit
    if (!formData.incorrect_answers || formData.incorrect_answers.length >= 4) {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      incorrect_answers: [...(prev.incorrect_answers || []), '']
    }));
  };

  const removeIncorrectAnswer = (index: number) => {
    if (!formData.incorrect_answers || index < 0 || index >= formData.incorrect_answers.length || formData.incorrect_answers.length <= 1) {
      return;
    }
    
    const newIncorrectAnswers = formData.incorrect_answers.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      incorrect_answers: newIncorrectAnswers
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    // Prepare form data with guard clauses and conditional inclusion
    const submitData: any = {
      question_id: formData.question_id,
      question: formData.question,
      answer: formData.answer
    };

    // Only include incorrect_answers if they exist and contain non-empty values
    if (formData.incorrect_answers && formData.incorrect_answers.length > 0) {
      const filteredIncorrectAnswers = formData.incorrect_answers.filter(answer => 
        answer && answer.trim() !== ''
      );
      
      // Only add to submitData if we have actual content
      if (filteredIncorrectAnswers.length > 0) {
        submitData.incorrect_answers = filteredIncorrectAnswers;
      }
    }

    console.log('Submitting form data:', submitData);

    try {
      const response = await fetch('/dashboard/edit_quiz_question', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();

      if (response.ok) {
        // Success - show toast and update data via callback
        setToast({
          message: 'Question updated successfully!',
          type: 'success',
          isVisible: true
        });
        
        // Call onSuccess with the updated question data from server
        if (onSuccess && data.question) {
          onSuccess(data.question);
        }
        
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        // Handle errors
        if (data.details && Array.isArray(data.details)) {
          setErrors(data.details);
        } else if (data.error) {
          setErrors([data.error]);
        } else {
          setErrors(['An error occurred while updating the question']);
        }
      }
    } catch (error) {
      console.error('Error updating question:', error);
      setErrors(['Network error occurred. Please try again.']);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToastClose = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  // Helper function to determine if this question type supports incorrect answers
  const shouldShowIncorrectAnswers = () => {
    return formData.incorrect_answers && formData.incorrect_answers.length > 0;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Edit Quiz Question</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isLoading}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <ul className="list-disc list-inside text-sm text-red-600">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question Text */}
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                Question
              </label>
              <textarea
                id="question"
                value={formData.question}
                onChange={(e) => handleInputChange('question', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                required
                disabled={isLoading}
              />
            </div>

            {/* Correct Answer */}
            <div>
              <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
                Correct Answer
              </label>
              <input
                type="text"
                id="answer"
                value={formData.answer}
                onChange={(e) => handleInputChange('answer', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isLoading}
              />
            </div>

            {/* Incorrect Answers - Only show for multiple choice questions */}
            {(shouldShowIncorrectAnswers() || formData.incorrect_answers?.length === 0) && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Incorrect Answers {!shouldShowIncorrectAnswers() && "(Optional - for multiple choice questions)"}
                  </label>
                  {(!formData?.incorrect_answers || formData?.incorrect_answers?.length < 4) && (
                    <button
                      type="button"
                      onClick={addIncorrectAnswer}
                      className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                      disabled={isLoading}
                    >
                      + Add Option
                    </button>
                  )}
                </div>
                
                <div className="space-y-2">
                  {formData?.incorrect_answers?.map((answer, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={answer || ''}
                        onChange={(e) => handleIncorrectAnswerChange(index, e.target.value)}
                        placeholder={`Incorrect answer ${index + 1}`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={isLoading}
                      />
                      {formData?.incorrect_answers && formData.incorrect_answers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeIncorrectAnswer(index)}
                          className="px-3 py-2 text-red-600 hover:text-red-800 transition-colors"
                          disabled={isLoading}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  )) || (
                    <p className="text-sm text-gray-500 italic">
                      No incorrect answers - this appears to be a long-form response question.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update Question'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={handleToastClose}
      />
    </div>
  );
};

export default EditQuizQuestionForm;