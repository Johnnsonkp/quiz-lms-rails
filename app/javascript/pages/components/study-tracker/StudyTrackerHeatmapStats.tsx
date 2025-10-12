export const HeatMapStats = ({summary}: any) => {
  return <div className="flex justify-between items-center pb-3 pt-1">
        <div className="text-sm text-gray-500">
          <div className="flex space-y-1">
            <div className=''>
              <span className="mr-4 text-xs font-semibold">Total Hours: {summary && summary.total_hours}</span>
              <span className="mr-4 text-xs font-semibold">Days Studied: {summary && summary.total_days}</span>
              <span className='text-xs font-semibold'>Avg Daily: {summary && summary.average_per_day?.toFixed(1)}</span>
            </div>
          </div>
        </div>
    </div>
  }