import { useState } from 'react';

interface StudyGoalSetterProps {
  currentGoal: number;
  onGoalUpdate: (newGoal: number) => void;
  loading?: boolean;
}

export default function StudyGoalSetter({ 
  currentGoal, 
  onGoalUpdate, 
  loading = false 
}: StudyGoalSetterProps) {
  const [goalHours, setGoalHours] = useState(currentGoal);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSaveGoal = async () => {
    if (goalHours < 0.5 || goalHours > 24) {
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
        body: JSON.stringify({ goal_hours: goalHours })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        onGoalUpdate(goalHours);
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
    setGoalHours(currentGoal);
    setIsEditing(false);
    setError(null);
  };

  const predefinedGoals = [2, 4, 6, 8, 10, 12];

  return (
    <div className="bg-white p-3 rounded-lg border">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Daily Study Goal</span>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="text-blue-600 text-xs hover:text-blue-800 transition-colors"
            disabled={loading}
          >
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          {/* Quick select buttons */}
          <div className="flex flex-wrap gap-1">
            {predefinedGoals.map(hours => (
              <button
                key={hours}
                onClick={() => setGoalHours(hours)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  goalHours === hours 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {hours}h
              </button>
            ))}
          </div>

          {/* Custom input */}
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={goalHours}
              onChange={(e) => setGoalHours(parseFloat(e.target.value) || 0)}
              className="flex-1 px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              min="0.5"
              max="24"
              step="0.5"
              placeholder="Hours"
            />
            <span className="text-xs text-gray-500">hours</span>
          </div>

          {/* Error message */}
          {error && (
            <p className="text-xs text-red-600">{error}</p>
          )}

          {/* Action buttons */}
          <div className="flex space-x-2">
            <button 
              onClick={handleSaveGoal}
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white text-xs py-1 px-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
            <button 
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1 bg-gray-300 text-gray-700 text-xs py-1 px-2 rounded hover:bg-gray-400 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-800">{currentGoal} hours</span>
          <div className="text-xs text-gray-500">
            {currentGoal <= 4 ? '🟢 Light' : currentGoal <= 8 ? '🟡 Moderate' : '🔴 Intensive'}
          </div>
        </div>
      )}
    </div>
  );
}