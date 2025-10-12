export default function ProgressCircle({ progress, status}: {progress: number, status: string}) {

  const getStatusFillColor: any = ({status}: any) => {
    console.log("Status in ProgressCircle:", status);
    
    if (status === 'completed') return 'text-emerald-500';
    if (status === 'on-track') return 'text-blue-500';
    if (status === 'behind') return 'text-red-500';
    return 'text-red-500';
  };

  let progressStatus = getStatusFillColor({status})

  return (
    <div className="relative w-[80%] h-[100%] flex items-start justify-start flex-[0.6]">
      {/* <svg className="w-13 h-13 transform -rotate-90" viewBox="0 0 32 32"> */}
      <svg className="w-[80%] h-[80%] transform -rotate-90" viewBox="0 0 32 32">
        {/* Background circle */}
        <circle
          cx="16"
          cy="16"
          r="14"
          stroke="currentColor"
          strokeWidth="3"
          fill="transparent"
          className="text-gray-200"
        />
        {/* Progress circle */}
        <circle
          cx="16"
          cy="16"
          r="14"
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={`${87.96 * (progress / 100)} 87.96`} // 65% progress
          strokeLinecap="round"
          className={`${progressStatus || 'text-emerald-500'}`}
        />
      </svg>
      {/* Progress percentage text */}
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="text-lg font-semibold text-gray-700 mr-5">{Number(progress) || progress}%</span>
    </div>
  </div>
  )
}
