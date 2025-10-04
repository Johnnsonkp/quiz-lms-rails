import 'react-calendar-heatmap/dist/styles.css';
import '../heatmap/react-calendar-heatmap.css';

import React, { useEffect, useMemo, useState } from 'react';

import CalendarHeatmap from 'react-calendar-heatmap';

interface StudyActivity {
  date: string; // ISO date string (YYYY-MM-DD)
  hours: number; // Number of study hours on this date
}

interface StudyHoursHeatmapProps {
  user?: {
    id: number;
    email: string;
    name?: string;
  } | null;
  startDate?: Date;
  endDate?: Date;
  onDateClick?: (value: any) => void;
  refreshTrigger?: number; // To trigger refresh when new data is added
}

const StudyHoursHeatmap: React.FC<StudyHoursHeatmapProps> = ({
  user,
  startDate,
  endDate,
  onDateClick,
  refreshTrigger
}) => {
  const [studyActivities, setStudyActivities] = useState<StudyActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<{
    total_hours: number;
    average_daily_hours: number;
    days_studied: number;
  } | null>(null);

  const today = new Date();
  
  // Default to showing last 6 months if no dates provided
  const defaultStartDate = useMemo(() => {
    const date = new Date(today);
    date.setMonth(date.getMonth() - 4);
    return date;
  }, [today]);

  const defaultEndDate = useMemo(() => {
    const date = new Date(today);
    date.setMonth(date.getMonth() + 3);
    return date;
  }, [today]);

  // Fetch study hours data from API
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchStudyData = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          start_date: (startDate || defaultStartDate).toISOString().split('T')[0],
          end_date: (endDate || defaultEndDate).toISOString().split('T')[0]
        });

        const response = await fetch(`/dashboard/study_hours_data?${params}`, {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched study hours data:', data);
        setStudyActivities(data.activity_data || []);
        setSummary(data.summary || null);
        setError(null);
      } catch (error) {
        console.error('Error fetching study hours data:', error);
        setError('Failed to load study hours data');
        setStudyActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudyData();
  }, [user, startDate, endDate, refreshTrigger]);

  // Transform the study activities data for the heatmap
  const heatmapValues = useMemo(() => {
    return studyActivities.map(activity => ({
      date: new Date(activity.date),
      count: activity.hours, // Using 'count' for compatibility with heatmap component
      hours: activity.hours
    }));
  }, [studyActivities]);

  // Modify viewBox after component mounts
  useEffect(() => {
    const svg = document.querySelector('.heatmap-container svg');
    if (svg) {
      svg.setAttribute('viewBox', '10 7 350 90');
    }
  }, [heatmapValues, refreshTrigger]); 

  // Generate tooltip content
  const getTooltipDataAttrs = (value: any) => {
    if (!value || !value.date || !(value.date instanceof Date)) {
      return { 'data-tip': 'No date: No study time logged' };
    }

    if (!value || value.hours === 0) {
      return {
        'data-tip': `${value?.date?.toISOString().slice(0, 10) || 'No date'}: No study time logged`
      };
    }

    const dateStr = value.date.toISOString().slice(0, 10);
    const hoursText = value.hours === 1 ? 'hour' : 'hours';
    const tooltip = `${dateStr}: ${value.hours} ${hoursText} studied`;
    
    return { 'data-tip': tooltip };
  };

  // Determine CSS class based on study hours
  const getClassForValue = (value: any) => {
    if (!value || value.hours === 0) {
      return 'color-empty';
    }
    
    // Study hours thresholds (adjust based on your preferences)
    const thresholds = [0.5, 1, 2, 3, 4, 5, 6, 7, 8, 10]; // Hours studied
    
    if (value.hours >= thresholds[9]) return 'color-github-10'; // 10+ hours
    if (value.hours >= thresholds[8]) return 'color-github-9';  // 8+ hours
    if (value.hours >= thresholds[7]) return 'color-github-8';  // 7+ hours
    if (value.hours >= thresholds[6]) return 'color-github-7';  // 6+ hours
    if (value.hours >= thresholds[5]) return 'color-github-6';  // 5+ hours
    if (value.hours >= thresholds[4]) return 'color-github-5';  // 4+ hours
    if (value.hours >= thresholds[3]) return 'color-github-4';  // 3+ hours
    if (value.hours >= thresholds[2]) return 'color-github-3';  // 2+ hours
    if (value.hours >= thresholds[1]) return 'color-github-2';  // 1+ hours
    if (value.hours >= thresholds[0]) return 'color-github-1';  // 30 minutes+
    return 'color-github-1'; // Light activity
  };

  const handleClick = (value: any) => {
    if (!value || !value?.date || !(value?.date instanceof Date)) return;
    
    if (onDateClick) {
      onDateClick(value);
    } else if (value && value.hours > 0) {
      // Default behavior: show alert with details
      const dateStr = value.date?.toISOString().slice(0, 10);
      const hoursText = value.hours === 1 ? 'hour' : 'hours';
      alert(`${dateStr}: ${value.hours} ${hoursText} studied`);
    }
  };

  if (!user) {
    return (
      <div className="study-hours-heatmap">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Study Hours Tracker
          </h3>
          <p className="text-sm text-gray-600">
            Please log in to track your study hours.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="study-hours-heatmap">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Study Hours Tracker
          </h3>
          <p className="text-sm text-gray-600">Loading your study hours...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="study-hours-heatmap">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Study Hours Tracker
          </h3>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  const HeatMapStats = () => {
    return <div className="flex justify-between items-center pb-3 pt-1">
        {summary && (
          <div className="text-sm text-gray-500">
            <div className="flex space-y-1">
              <div className=''>
                <span className="mr-4 text-xs">Total Hours: {summary.total_hours}</span>
                <span className="mr-4 text-xs">Days Studied: {summary.days_studied}</span>
                <span className='text-xs'>Avg Daily: {summary.average_daily_hours?.toFixed(1)}h</span>
              </div>
            </div>
          </div>)}
      </div>
  }

  return (
    <div className="study-hours-heatmap">
        <HeatMapStats />
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
    </div>
  );
};

export default StudyHoursHeatmap;