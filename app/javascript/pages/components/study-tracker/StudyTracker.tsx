import React, { useState } from 'react';

import StudyHoursForm from './StudyHoursForm';
import StudyHoursHeatmap from './StudyHoursHeatmap';

interface StudyTrackerProps {
  user?: {
    id: number;
    email: string;
    name?: string;
  } | null;
}

const StudyTracker: React.FC<StudyTrackerProps> = ({ user }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStudyHoursSubmit = async (date: string, hours: number) => {
    if (!user) {
      alert('Please log in to track study hours');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/dashboard/study_hours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          study_hour: {
            date: date,
            hours: hours
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Study hours saved:', data);
      
      // Trigger refresh of the heatmap
      setRefreshTrigger(prev => prev + 1);
      
      // Show success message
      alert(`Successfully logged ${hours} hours of study for ${date}`);
      
    } catch (error) {
      console.error('Error saving study hours:', error);
      alert(`Failed to save study hours: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error; // Re-throw so the form can handle it
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="study-tracker space-y-6 flex justify-between w-full align-middle items-center">
      
      <div className='flex-[0.8] mr-2'>
        {/* Study Hours Heatmap */}
        <StudyHoursHeatmap 
          user={user}
          refreshTrigger={refreshTrigger}
        />
      </div>
      <div className='flex-[0.2]'>
        {/* Study Hours Form */}
        <StudyHoursForm 
          onSubmit={handleStudyHoursSubmit}
          loading={isSubmitting}
        />
      </div>
    </div>
  );
};

export default StudyTracker;