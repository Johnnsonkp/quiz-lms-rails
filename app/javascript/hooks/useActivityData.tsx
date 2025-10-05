import { useCallback, useMemo, useState } from 'react';

interface QuizActivity {
  date: string; // ISO date string (YYYY-MM-DD)
  count: number; // Number of quizzes completed on this date
  attempted?: number; // Number of quizzes attempted on this date
  questions_answered?: number; // Number of questions answered on this date
  activity_type?: string; // Type of activity: 'quiz', 'question', 'combined'
}

export const useActivityData = () => {
  const [loading, setLoading] = useState<Boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [quizActivities, setQuizActivities] = useState<QuizActivity[]>([]);
  const [summary, setSummary] = useState<any>(null);

  const fetchActivityData = useCallback(async (activityType: string, startDate: Date | any, endDate: Date | null | any) => {
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
        setQuizActivities(data.activity_data || []);
        setSummary(data.summary || null);
        setError(null);
        return data;
      } catch (error) {
        setError('Failed to load activity data');
      } finally {
        setLoading(false);
      }
  }, []);

  return { loading, error, fetchActivityData, quizActivities, summary};
};