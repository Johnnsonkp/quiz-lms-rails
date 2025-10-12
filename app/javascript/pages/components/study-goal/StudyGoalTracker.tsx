import { useEffect, useState } from 'react';

import StudyGoalProgress from './StudyGoalProgress';

interface StudyGoalTrackerProps {
  user: any;
}

interface StudyGoalData {
  goal_hours: number;
  actual_hours: number;
  progress_percentage: number;
  hours_remaining: number;
  status: string;
  is_goal_achieved: boolean;
}

export default function StudyGoalTracker({ user }: StudyGoalTrackerProps) {
  const [goalData, setGoalData] = useState<StudyGoalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoalProgress = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/dashboard/study_goal_progress', {
        method: 'GET',
        credentials: 'same-origin',
        headers: { 
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      if (response.ok) {
        setGoalData(data);
        setError(null);
        return data;
      } else {
        setError(data.error || 'Failed to fetch goal progress');
      }
    } catch (error) {
      console.error('Error fetching goal progress:', error);
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoalProgress();
  }, [user]);

  const handleGoalUpdate = (newGoal: number) => {
    if (goalData) {
      // Update the goal and recalculate progress
      const updatedData = {
        ...goalData,
        goal_hours: newGoal
      };
      
      // Recalculate progress with new goal
      const newProgressPercentage = newGoal > 0 
        ? Math.min((goalData.actual_hours / newGoal) * 100, 100) 
        : 0;
      
      updatedData.progress_percentage = newProgressPercentage;
      updatedData.hours_remaining = Math.max(newGoal - goalData.actual_hours, 0);
      updatedData.is_goal_achieved = newProgressPercentage >= 100;
      
      // Update status
      if (newProgressPercentage >= 100) updatedData.status = 'completed';
      else if (newProgressPercentage >= 70) updatedData.status = 'on-track';
      else if (newProgressPercentage >= 50) updatedData.status = 'behind';
      else updatedData.status = 'far-behind';

      setGoalData(updatedData);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="bg-gray-200 h-16 rounded-lg"></div>
        <div className="bg-gray-200 h-40 rounded-lg"></div>
      </div>
    );
  }

  if (error || !goalData) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 text-sm">
          {error || 'Failed to load goal data'}
        </p>
        <button 
          onClick={fetchGoalProgress}
          className="mt-2 text-red-700 text-xs underline hover:no-underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-0 h-full ">
      <StudyGoalProgress 
        goalHours={goalData.goal_hours}
        actualHours={goalData.actual_hours}
        progressPercentage={goalData.progress_percentage}
        hoursRemaining={goalData.hours_remaining}
        status={goalData.status}
        isGoalAchieved={goalData.is_goal_achieved}
        onGoalUpdate={handleGoalUpdate}
      />
      
      
      {goalData.status === 'on-track' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-blue-800 text-xs">
            🚀 Great momentum! You're on track to achieve your goal today.
          </p>
        </div>
      )}
    </div>
  );
}