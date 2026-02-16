function HeatmapLegend() {
  return (
    <div className="mt-3 w-[100%] flex items-center justify-between text-xs text-gray-500 h-3">
      <div className='mr-2'>Less</div>
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
  )
}

export default HeatmapLegend