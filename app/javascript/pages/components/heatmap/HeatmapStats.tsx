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
  return ( 
    <div className="flex justify-between items-center">
        {summary && activeTab == 'quiz' && (
          <div className="text-sm text-gray-500 pb-3 pt-1">
            <div className="flex space-y-1">
              <div className=''>
                <span className="mr-4 text-xs">Period Completed: {summary.total_completed}</span>
                <span className='text-xs'>Period Attempted: {summary.total_attempted}</span>
              </div>
              {summary.all_time_completed !== undefined && (
                <div className=" text-gray-400">
                  <span className="mr-4 ml-4 text-xs">All-time Completed: {summary.all_time_completed}</span>
                  <span className="text-xs">All-time Attempted: {summary.all_time_attempted}</span>
                </div>
              )}
            </div>
          </div>
        )}
    </div>
  );
}