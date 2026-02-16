import React, { useState } from 'react';

import StudyHoursForm from './StudyHoursForm';
import StudyHoursHeatmap from './StudyHoursHeatmap';
import {StudyTrackerProps} from '../../../types/heatmapTypes';

const StudyTracker: React.FC<StudyTrackerProps> = ({ user }) => {
  // const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  return (
    <div className="study-tracker space-y-6 flex justify-between w-full align-middle items-center">
      
      <div className='flex-[0.85] mr-1'>
        {/* Study Hours Heatmap */}
        {/* <StudyHoursHeatmap 
          user={user}
          refreshTrigger={refreshTrigger}
        /> */}
      </div>
      <div className='flex-[0.18]'>
        <StudyHoursForm 
          loading={isSubmitting}
          user={user}
          setRefreshTrigger={setRefreshTrigger}
        />
      </div>
    </div>
  );
};

export default StudyTracker;