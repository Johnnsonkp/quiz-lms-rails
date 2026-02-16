export interface StudyHoursHeatmapProps {
  user?: {
    id: number;
    email: string;
    name?: string;
  } | null;
  startDate: Date;
  endDate: Date;
  onDateClick?: (value: any) => void;
  refreshTrigger?: boolean; // To trigger refresh when new data is added
  today: Date; // Pass today's date from parent component
}

export interface StudyActivity {
  date: string; 
  hours: number; 
  count: number; 
}

export interface StudyTrackerProps {
  user?: {
    id: number;
    email: string;
    name?: string;
  } | null;
}