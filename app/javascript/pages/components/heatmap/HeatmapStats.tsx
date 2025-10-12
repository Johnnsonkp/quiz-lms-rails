interface HeatMapStatsProps {
  summary: {
    total_completed: number;
    total_attempted: number;
    all_time_completed?: number;
    all_time_attempted?: number;
  } | null;
  activeTab: string;  
}

export const HeatmapStats = ({summary, activeTab}: HeatMapStatsProps) => {
  return activeTab == "quiz" &&  <div className="flex justify-between items-center pb-3 pt-1">
          <div className="text-sm text-gray-500">
            <div className="flex space-y-1">
              <div className=''>
                <span className="mr-4 text-xs font-semibold">Period Completed: {summary && summary.total_completed}</span>
                <span className='text-xs font-semibold'>Period Attempted: {summary && summary.total_attempted}</span>
                <span className="mr-4 ml-4 text-xs font-semibold">All-time Completed: {summary && summary.all_time_completed}</span>
                <span className="text-xs font-semibold">All-time Attempted: {summary && summary.all_time_attempted}</span>
              </div>
            </div>
          </div>
        </div>
}