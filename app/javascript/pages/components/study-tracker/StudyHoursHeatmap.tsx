import 'react-calendar-heatmap/dist/styles.css';
import '../heatmap/react-calendar-heatmap.css';

import React, { useEffect, useMemo, useState } from 'react';
import { StudyActivity, StudyHoursHeatmapProps } from '../../../types/heatmapTypes';

import CalendarHeatmap from 'react-calendar-heatmap';
import DashboardStatus from '../heatmap/DashboardStatus';
import {HeatMapStats} from './StudyTrackerHeatmapStats';
import {fetchStudyHeatmapActivityData} from '../../../services/heatmapServices/fetchAvtivityData';

const StudyHoursHeatmap: React.FC<StudyHoursHeatmapProps> = ({
  user,
  startDate,
  endDate,
  onDateClick,
  refreshTrigger,
  today,
}) => {
  const [studyActivities, setStudyActivities] = useState<StudyActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<{
    total_hours: number;
    average_daily_hours: number;
    days_studied: number;
  } | null>(null);

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

  const loadHeatmapData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    if (studyActivities.length > 0) return;
    const svg = document.querySelector('.heatmap-container svg');
    if (svg) { svg.setAttribute('viewBox', '10 7 400 90');}

    const params = new URLSearchParams({
      start_date: (startDate || defaultStartDate).toISOString().split('T')[0],
      end_date: (endDate || defaultEndDate).toISOString().split('T')[0]
    });

    const data = await fetchStudyHeatmapActivityData({params});
    if(!data) return;
    
    setStudyActivities(data.activity_data || []);
    setSummary(data.summary || null);
    setError(null);
    setLoading(false);
    console.log('Fetched activity data:', data);
  };

  useEffect(() => {
    loadHeatmapData();
  }, [refreshTrigger]); 

  const heatmapValues = useMemo(() => {
    return studyActivities.map(activity => ({
      date: new Date(activity.date),
      count: activity.hours || activity?.count, 
      hours: activity.hours || activity?.count
    }));
  }, [studyActivities]);

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

  const getClassForValue = (value: any) => {
    if (!value || value.hours === 0) return 'color-empty';

    const thresholds = [0.5, 1, 2, 3, 4, 5, 6, 7, 8, 10]; 
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
    return 'color-github-1';
  };

  const handleClick = (value: any) => {
    if (!value || !value?.date || !(value?.date instanceof Date)) return;
    
    if (onDateClick) {
      onDateClick(value);
    } else if (value && value.hours > 0) {
      const dateStr = value.date?.toISOString().slice(0, 10);
      const hoursText = value.hours === 1 ? 'hour' : 'hours';
      alert(`${dateStr}: ${value.hours} ${hoursText} studied`);
    }
  };

  <DashboardStatus 
    user={user} 
    loading={loading} 
    error={error} />

  return (
    <div className="study-hours-heatmap">
      <HeatMapStats summary={summary} />
      <CalendarHeatmap
        startDate={startDate || defaultStartDate}
        endDate={endDate || defaultEndDate}
        values={heatmapValues}
        classForValue={getClassForValue}
        titleForValue={getClassForValue}
        tooltipDataAttrs={getTooltipDataAttrs}
        showWeekdayLabels={true}
        showMonthLabels={true}
        showOutOfRangeDays={true}
        onClick={handleClick}
        gutterSize={1}
        horizontal={true}
      />
    </div>
  );
};

export default StudyHoursHeatmap;