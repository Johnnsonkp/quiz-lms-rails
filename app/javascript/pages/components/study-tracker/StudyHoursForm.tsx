import React, { useState } from 'react';

interface StudyHoursFormProps {
  onSubmit: (date: string, hours: number) => void;
  loading?: boolean;
}

const StudyHoursForm: React.FC<StudyHoursFormProps> = ({ onSubmit, loading = false }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [hours, setHours] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !hours || parseFloat(hours) <= 0) {
      alert('Please select a date and enter valid study hours (greater than 0)');
      return;
    }

    const studyHours = parseFloat(hours);
    if (studyHours > 24) {
      alert('Study hours cannot exceed 24 hours per day');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(selectedDate, studyHours);
      setHours(''); // Reset hours after successful submission
    } catch (error) {
      console.error('Error submitting study hours:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
      <h3 className="text-xs font-semibold text-gray-900 mb-2">Log Study Hours</h3>
      
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          {/* Date Input */}
          <div>
            <label htmlFor="study-date" className="block text-sm font-xs text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              id="study-date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]} // Can't log future dates
              className="text-xs w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Hours Input */}
          <div>
            <label htmlFor="study-hours" className="block text-sm font-xs text-gray-700 mb-1">
              Study Hours
            </label>
            <input
              type="number"
              id="study-hours"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              min="0.25"
              max="24"
              step="0.25"
              placeholder="e.g., 2.5"
              className="text-xs w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            {/* <p className="text-xs text-gray-500 mt-1">Enter hours in increments of 0.25 (15 minutes)</p> */}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || loading}
            className={`
              cursor-pointer px-4 py-2 text-xs font-medium rounded-md transition-all duration-200 ease-in-out
              ${isSubmitting || loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform active:scale-95'
              }
            `}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              'Log Study Hours'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudyHoursForm;