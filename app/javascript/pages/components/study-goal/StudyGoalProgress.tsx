import React, { useEffect } from "react";

import ProgressCircle from "../progress/ProgressCircle";
import SliderButton from "../heatmap/SliderButton";
import StudyHoursForm from "../study-tracker/StudyHoursForm";
import { useState } from "react";

interface StudyGoalProgressProps {
  goalHours: number;
  actualHours: number;
  progressPercentage: number;
  hoursRemaining: number;
  status: string;
  isGoalAchieved: boolean;
  onGoalUpdate: (newGoal: number) => void;
}

export default function StudyGoalProgress({ 
  goalHours, 
  actualHours, 
  progressPercentage, 
  hoursRemaining, 
  status,
  isGoalAchieved,
  onGoalUpdate
}: StudyGoalProgressProps) {
  
  // const getStatusFillColor = () => {
  //   if (status === 'completed') return 'text-emerald-500';
  //   if (status === 'on-track') return 'text-blue-500';
  //   if (status === 'behind') return 'text-red-500';
  //   return 'text-red-500';
  // };

  const [activeTab, setActiveTab] = React.useState<'Progress' | 'Edit' | 'Log hours'>('Progress');
  const [currentGoalHours, setCurrentGoalHours] = useState(goalHours);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<boolean>(false);

   const handleSaveGoal = async () => {
    if (currentGoalHours < 0.5 || currentGoalHours > 24) {
      setError('Goal must be between 0.5 and 24 hours');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/dashboard/update_study_goal', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'X-CSRF-Token': (document.querySelector('[name="csrf-token"]') as HTMLMetaElement)?.content || ''
        },
        body: JSON.stringify({ goal_hours: currentGoalHours })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        onGoalUpdate(currentGoalHours);
        setIsEditing(false);
        console.log('Goal updated successfully:', data);
      } else {
        setError(data.error || 'Failed to update goal');
      }
    } catch (error) {
      console.error('Failed to update goal:', error);
      setError('Network error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setCurrentGoalHours(goalHours);
    setActiveTab('Progress');
    setIsEditing(false);
    setError(null);
  };

  useEffect(() => {
    if (activeTab === 'Edit'.toLowerCase()) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [activeTab]);

  const predefinedGoals = [2, 4, 6, 8, 10];
  
  return (
    <div className="bg-white p-3 rounded-lg shadow-sm border-gray-300 border w-[300px] h-full">
      <div className="w-[100%] m-auto">
        <SliderButton 
          activeTab={activeTab} 
          setActiveTab={(tab) => setActiveTab(tab as 'Progress' | 'Edit' | 'Log hours')} 
          options={['Progress', 'Edit', 'Log hours']}
        />
      </div>

      {isEditing ? (
        <div className="space-y-3">
          {/* Quick select buttons */}
          <div className="flex flex-wrap gap-1">
            {predefinedGoals.map(hours => (
              <button
                key={hours}
                onClick={() => setCurrentGoalHours(hours)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  currentGoalHours === hours 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {hours}h
              </button>
            ))}
            <div className="flex align-middle items-center ml-3">
              <input
                type="number"
                value={currentGoalHours}
                onChange={(e) => setCurrentGoalHours(parseFloat(e.target.value) || 0)}
                className="flex-1 w-13 px-1 py-0 text-sm border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                min="0.5"
                max="24"
                step="0.5"
                placeholder="Hours"
              />
              <span className="text-xs text-gray-500 ml-1">hrs</span>
            </div>
          </div>

          {/* Custom input */}
          <div className="flex items-right space-x-2 justify-end">

          {/* Error message */}
          {error && ( <p className="text-xs text-red-600">{error}</p>)}

            {/* Action buttons */}
            <div className="flex space-x-1 justify-end">
              <button 
                onClick={handleSaveGoal}
                disabled={isSubmitting}
                className="cursor-pointer flex-1 bg-blue-600 text-white text-xs py-1 px-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
              <button 
                onClick={handleCancel}
                disabled={isSubmitting}
                className="cursor-pointer flex-1 bg-gray-300 text-gray-700 text-xs py-1 px-2 rounded hover:bg-gray-400 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
            
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between my-4">
          <span className="text-sm font-semibold text-gray-800">Hours Studied Target: {Number(goalHours)} hours</span>
        </div>
      )}

      { activeTab === 'Log hours'.toLowerCase() && <StudyHoursForm setRefreshTrigger={setRefreshTrigger} />}
      
      
      { activeTab !== 'Log hours'.toLowerCase() &&
      <>
       <div className="flex justify-between align-middle items-center"> 
          <ProgressCircle 
            progress={Math.min(progressPercentage, 100)}
            status={status}
          />
      
          <div className="space-y-2 flex-[0.5] justify-end align-bottom items-start h-[100%]">
            <p className="mt-6 border-2 border-gray-200 rounded-lg py-1 px-2 text-sm font-normal text-gray-800">
              Target: {Number(goalHours) || goalHours} hrs
            </p>
        
            <p className="border-2 border-gray-200 rounded-lg py-1 px-2 text-sm font-normal text-gray-800">
              Progress: {Number(actualHours) || actualHours} hrs
            </p>
            
            {!isGoalAchieved && hoursRemaining > 0 && (
              <p className="mt-4 border-2 border-gray-200 rounded-lg py-1 px-2 text-xs text-orange-600">
                Remaining: {Number(hoursRemaining) || hoursRemaining} hrs
              </p>
            )}
            
            {isGoalAchieved && (
              <p className="mt-6 w-[100%] text-sm text-green-600 font-medium flex items-center justify-center">
                <span className="mr-1">🏆</span>
                Goal achieved!
              </p>
            )}
            
            {progressPercentage > 100 && (
              <p className="text-xs text-blue-600">
                {((progressPercentage - 100) * currentGoalHours / 100).toFixed(1)}h over goal!
              </p>
            )}
          </div>
        </div> 
        </>}
    </div>
  );
}