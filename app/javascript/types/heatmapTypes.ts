export interface StudyHoursHeatmapProps {
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

export interface StudyActivity {
  date: string; 
  hours: number; 
  count: number; 
}