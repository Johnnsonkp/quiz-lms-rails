import 'react-calendar-heatmap/dist/styles.css';
import './react-calendar-heatmap.css'

import React, { useEffect, useMemo, useState } from 'react';

import CalendarHeatmap from 'react-calendar-heatmap';

interface QuizActivity {
  date: string; // ISO date string (YYYY-MM-DD)
  count: number; // Number of quizzes completed on this date
  attempted?: number; // Number of quizzes attempted on this date
  questions_answered?: number; // Number of questions answered on this date
  activity_type?: string; // Type of activity: 'quiz', 'question', 'combined'
}

interface DashboardHeatmapProps {
  user?: {
    id: number;
    email: string;
    name?: string;
  } | null;
  activityType?: 'quiz' | 'question' | 'combined';
  startDate?: Date;
  endDate?: Date;
  onDateClick?: (value: any) => void;
}

const DashboardHeatmap: React.FC<DashboardHeatmapProps> = ({
  user,
  activityType = 'combined',
  startDate,
  endDate,
  onDateClick
}) => {
  const [quizActivities, setQuizActivities] = useState<QuizActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<{
    total_completed: number;
    total_attempted: number;
    all_time_completed?: number;
    all_time_attempted?: number;
  } | null>(null);

  const today = new Date();
  
  // Default to showing last 6 months if no dates provided
  const defaultStartDate = useMemo(() => {
    const date = new Date(today);
    date.setMonth(date.getMonth() - 4);
    return date;
  }, [today]);

  // const defaultEndDate = useMemo(() => today, [today]);
  const defaultEndDate = useMemo(() => {
    const date = new Date(today);
    date.setMonth(date.getMonth() + 3);

    return date;
  });

  // Fetch activity data from API
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchActivityData = async () => {
      console.log('user in fetchActivityData', user);
      console.log('user in activityType', activityType);
      try {
        setLoading(true);
        const params = new URLSearchParams({
          type: activityType,
          start_date: (startDate || defaultStartDate).toISOString().split('T')[0],
          end_date: (endDate || defaultEndDate).toISOString().split('T')[0]
        });

        const response = await fetch(`/dashboard/study_activity?${params}`, {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched activity data:', data);
        setQuizActivities(data.activity_data || []);
        setSummary(data.summary || null);
        setError(null);
      } catch (error) {
        console.error('Error fetching activity data:', error);
        setError('Failed to load activity data');
        setQuizActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityData();
  }, []);

  // Transform the quiz activities data for the heatmap
  const heatmapValues = useMemo(() => {
    return quizActivities.map(activity => ({
      date: new Date(activity.date),
      count: activity.count,
      attempted: activity.attempted || 0,
      questions_answered: activity.questions_answered || 0,
      activity_type: activity.activity_type
    }));
  }, [quizActivities]);

  // Modify viewBox after component mounts
  useEffect(() => {
    const svg = document.querySelector('.heatmap-container svg');
    if (svg) {
      // svg.setAttribute('viewBox', '10 7 552 90');
      svg.setAttribute('viewBox', '10 7 400 90');
    }
  }, [heatmapValues]); 

  // Generate tooltip content
  const getTooltipDataAttrs = (value: any) => {
    if (!value || !value.date || !(value.date instanceof Date)) {
      return { 'data-tip': 'No date: No activity' };
    }

    if (!value || value.count === 0) {
      return {
        'data-tip': `${value?.date?.toISOString().slice(0, 10) || 'No date'}: No activity`
      };
    }

    const dateStr = value.date.toISOString().slice(0, 10);
    let tooltip = '';
    
    if (activityType === 'quiz') {
      const quizText = value.count === 1 ? 'quiz' : 'quizzes';
      tooltip = `${dateStr}: ${value.count} ${quizText} completed`;
      if (value.attempted > value.count) {
        tooltip += `, ${value.attempted} attempted`;
      }
    } else if (activityType === 'question') {
      const questionText = value.count === 1 ? 'question' : 'questions';
      tooltip = `${dateStr}: ${value.count} ${questionText} answered`;
    } else {
      tooltip = `${dateStr}: ${value.count} total activities`;
      if (value.questions_answered > 0) {
        tooltip += ` (${value.questions_answered} questions)`;
      }
    }
    
    return { 'data-tip': tooltip };
  };

  // Determine CSS class based on activity level
  const getClassForValue = (value: any) => {
    if (!value || value.count === 0) {
      return 'color-empty';
    }
    
    // Customize these thresholds based on activity type
    let thresholds;
    if (activityType === 'question') {
      thresholds = [1, 5, 10, 20, 30, 45, 55, 65, 75, 90]; // Questions answered
    } else {
      thresholds = [1, 2, 3, 5, 6, 7, 9, 15, 18, 21]; // Quizzes completed
    }
    
    if (value.count >= thresholds[10]) return 'color-github-10'; // Very active
    if (value.count >= thresholds[9]) return 'color-github-9'; // Active
    if (value.count >= thresholds[8]) return 'color-github-8'; // Moderate
    if (value.count >= thresholds[7]) return 'color-github-7'; // Very active

    if (value.count >= thresholds[6]) return 'color-github-6'; // Very active
    if (value.count >= thresholds[5]) return 'color-github-5'; // Active
    if (value.count >= thresholds[4]) return 'color-github-4'; // Moderate
    if (value.count >= thresholds[3]) return 'color-github-3'; // Very active
    if (value.count >= thresholds[2]) return 'color-github-2'; // Active
    if (value.count >= thresholds[1]) return 'color-github-1'; // Moderate
    return 'color-github-1'; // Light activity
  };

  const handleClick = (value: any) => {
    if (!value || !value?.date || !(value?.date instanceof Date)) return;
    
    if (onDateClick) {
      onDateClick(value);
    } else if (value && value.count > 0) {
      // Default behavior: show alert with details
      const dateStr = value.date?.toISOString().slice(0, 10);
      if (activityType === 'quiz') {
        alert(`${dateStr}: ${value.count} quiz(es) completed, ${value.attempted} attempted`);
      } else if (activityType === 'question') {
        alert(`${dateStr}: ${value.count} question(s) answered`);
      } else {
        alert(`${dateStr}: ${value.count} total activities`);
      }
    }
  };

  if (!user) {
    return (
      <div className="dashboard-heatmap">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Study Activity Heatmap
          </h3>
          <p className="text-sm text-gray-600">
            Please log in to view your study activity.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="dashboard-heatmap">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Study Activity Heatmap
          </h3>
          <p className="text-sm text-gray-600">Loading your activity data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-heatmap">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Study Activity Heatmap
          </h3>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-heatmap">
      <div className="mb-2">
        {/* <h3 className="text-md font-semibold text-gray-900 mb-2">
          Study Activity Heatmap
          {activityType === 'quiz' && ' - Quiz Completions'}
          {activityType === 'question' && ' - Questions Answered'}
          {activityType === 'combined' && ' - All Activities'}
        </h3> */}
        <div className="flex justify-between items-center">
          {/* <p className="text-sm text-gray-600">
            Track your study patterns over time. Darker squares indicate more activity.
          </p> */}
          {summary && (
            <div className="text-sm text-gray-500">
              <div className="flex space-y-1">
                <div>
                  <span className="mr-4">Period Completed: {summary.total_completed}</span>
                  <span>Period Attempted: {summary.total_attempted}</span>
                </div>
                {summary.all_time_completed !== undefined && (
                  <div className=" text-gray-400">
                    <span className="mr-4 ml-4">All-time Completed: {summary.all_time_completed}</span>
                    <span>All-time Attempted: {summary.all_time_attempted}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="heatmap-container bg-white p-2 rounded-lg border-2 border-gray-200 flex">
        <CalendarHeatmap
          startDate={startDate || defaultStartDate}
          endDate={endDate || defaultEndDate}
          values={heatmapValues}
          classForValue={getClassForValue}
          tooltipDataAttrs={getTooltipDataAttrs}
          showWeekdayLabels={true}
          showMonthLabels={true}
          onClick={handleClick}
          gutterSize={1}
          horizontal={true}
        />
        {/* <CalendarHeatmap
          startDate={startDate || defaultStartDate}
          endDate={endDate || defaultEndDate}
          values={heatmapValues}
          classForValue={getClassForValue}
          tooltipDataAttrs={getTooltipDataAttrs}
          showWeekdayLabels={true}
          showMonthLabels={true}
          onClick={handleClick}
          gutterSize={2}
          horizontal={true}
        /> */}
      </div>
      
      {/* Legend */}
      <div className="mt-3 w-[35%] flex items-center justify-between text-xs text-gray-500 h-3">
        <div>Less</div>
        <svg className="flex mx-auto items-center space-x-1 react-calendar-heatmap">
          <g className="flex mx-auto items-center w-3 h-3 rounded-sm border-2 border-red-500">
            <rect width="4" height="4" x="0" y="70" className="w-4 h-4 rounded-sm border color-github-1"></rect>
            <rect width="4" height="4" x="20" y="70" className="w-4 h-4 rounded-sm border color-github-2"></rect>
            <rect width="4" height="4" x="40" y="70" className="w-4 h-4 rounded-sm border color-github-3"></rect>
            <rect width="4" height="4" x="60" y="70" className="w-4 h-4 rounded-sm border color-github-4"></rect>
            <rect width="4" height="4" x="80" y="70" className="w-4 h-4 rounded-sm border color-github-5"></rect>
            <rect width="4" height="4" x="100" y="70" className="w-4 h-4 rounded-sm border color-github-6"></rect>
            <rect width="4" height="4" x="120" y="70" className="w-4 h-4 rounded-sm border color-github-7"></rect>
            <rect width="4" height="4" x="140" y="70" className="w-4 h-4 rounded-sm border color-github-8"></rect>
            <rect width="4" height="4" x="160" y="70" className="w-4 h-4 rounded-sm border color-github-9"></rect>
            <rect width="4" height="4" x="180" y="70" className="w-4 h-4 rounded-sm border color-github-10"></rect>
          </g>
        </svg>
        <div>More</div>
      </div>
    </div>
  );
};

export default DashboardHeatmap;
