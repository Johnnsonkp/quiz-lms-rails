import 'react-calendar-heatmap/dist/styles.css';
import './react-calendar-heatmap.css'

import { DashboardHeatmapProps, QuizActivity } from '../../../types/dashboard';
import React, { useEffect, useMemo, useState } from 'react';

import CalendarHeatmap from 'react-calendar-heatmap';
import DashboardStatus from './DashboardStatus';
import {HeatmapStats} from './HeatmapStats';
import StudyTracker from '../study-tracker/StudyTracker';
import {fetchHeatmapActivityData} from '../../../services/heatmapServices/fetchAvtivityData';

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

  const [activeTab, setActiveTab] = useState<'quiz' | 'study' | 'combined'>(activityType);
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
  }, [today]);

  const loadHeatmapData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    const svg = document.querySelector('.heatmap-container svg');
    if (svg) {
      svg.setAttribute('viewBox', '10 7 400 90');
    }
    if (quizActivities.length > 0) {
      return;
    }
    const params = new URLSearchParams({
      type: activityType,
      start_date: (startDate || defaultStartDate).toISOString().split('T')[0],
      end_date: (endDate || defaultEndDate).toISOString().split('T')[0]
    });

    const data = await fetchHeatmapActivityData({params});
    if(!data) return;
    
    setQuizActivities(data.activity_data || []);
    setSummary(data.summary || null);
    setError(null);
    setLoading(false);
    console.log('Fetched activity data:', data);
  };

  // Modify viewBox after component mounts
  useEffect(() => {
    loadHeatmapData();
  }, [activeTab]);


  const heatmapValues = useMemo(() => {
    return quizActivities.map(activity => ({
      date: new Date(activity?.date),
      count: activity?.count,
      attempted: activity?.attempted || 0,
      questions_answered: activity?.questions_answered || 0,
      activity_type: activity?.activity_type
    }));
  }, [quizActivities]);

  // Generate tooltip content
  const getTooltipDataAttrs = (value: any) => {
    if (!value || !value.date || !(value.date instanceof Date)) return { 'data-tip': 'No date: No activity' };

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
    } else if (activityType === 'study') {
      const studyText = value.count === 1 ? 'study' : 'studies';
      tooltip = `${dateStr}: ${value.count} ${studyText} completed`;
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
    if (!value || value.count === 0) return 'color-empty';
    
    let thresholds;
    if (activityType === 'study') {
      thresholds = [1, 5, 10, 20, 30, 45, 55, 65, 75, 90]; // Studies completed
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
      } else if (activityType === 'study') {
        alert(`${dateStr}: ${value.count} question(s) answered`);
      } else {
        alert(`${dateStr}: ${value.count} total activities`);
      }
    }
  };

  <DashboardStatus 
    user={user} 
    loading={loading} 
    error={error} />

  return (
    <div className="dashboard-heatmap">
      <div className="heatmap-container bg-white p-2 px-3 rounded-lg border-2 border-gray-200 flex-col">
        {/* <HeatMapSlider /> */}
        <div className="flex justify-start mb-2 mt-0">
          <nav className="bg-gray-200 rounded-md px-1 py-1 w-[240px] shadow-sm">
            <ul className="flex text-gray-600 gap-1 text-xs py-1.8 cursor-pointer">
              <div className="relative flex w-[100%] cursor-pointer h-[100%]">
                {/* Slider background */}
                <span
                  className="absolute cursor-pointer left-0 top-0 py-1 h-full
                  w-1/3 bg-white rounded-md shadow transition-transform duration-300 ease-in-out !font-bold"
                  style={{
                  transform: `translateX(${activeTab === 'quiz' ? '0%' : activeTab === 'study' ? '100%' : '200%'})`,
                  zIndex: 0,
                  }}
                />
                <li 
                  className="hover:bg-white !cursor-pointer py-1 relative
                  flex mx-auto z-10 w-1/4 rounded-md text-center justify-center align-middle items-center h-full" 
                  onClick={() => setActiveTab('quiz')}
                >
                  Quiz
                </li>
                <li 
                  className="hover:bg-white cursor-pointer py-1 relative 
                  flex mx-auto z-10 w-1/4 rounded-md text-center justify-center align-middle items-center" 
                  onClick={() => setActiveTab('study')}
                >
                  Study
                </li>
                <li 
                  className="hover:bg-white cursor-pointer py-1 relative 
                  flex mx-auto z-10 w-1/4 rounded-md text-center justify-center align-middle items-center" 
                  onClick={() => setActiveTab('combined')}
                >
                  All
                </li>
              </div>
            </ul>
          </nav>
        </div>
        <HeatmapStats summary={summary} activeTab={activeTab} />
        {activeTab == 'quiz' && 
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
          />}
        {activeTab == 'study' &&  <StudyTracker user={user} />}
      </div>
    </div>
  );
};

export default DashboardHeatmap;