// import CalendarHeatmap from 'react-calendar-heatmap';
// // import 'react-calendar-heatmap/dist/styles.css';
// import './react-calendar-heatmap.css'
// import type { TooltipDataAttrs } from 'react-calendar-heatmap';

// // interface QuizActivity {
// //   date: string; // ISO date string (YYYY-MM-DD)
// //   count: number; // Number of quizzes taken/completed on this date
// //   quizzes?: string[]; // Optional: array of quiz titles for tooltip
// // }

// // interface DashboardHeatmapProps {
// //   quizActivities?: QuizActivity[];
// //   startDate?: Date;
// //   endDate?: Date;
// //   onDateClick?: (value: any) => void;
// // }

// // const DashboardHeatmap: React.FC<DashboardHeatmapProps> = ({
// //   quizActivities = [],
// //   startDate,
// //   endDate,
// //   onDateClick
// // }) => {
// //   const today = new Date();
  
// //   // Default to showing last 6 months if no dates provided
// //   const defaultStartDate = useMemo(() => {
// //     const date = new Date(today);
// //     date.setMonth(date.getMonth() - 6);
// //     return date;
// //   }, [today]);

// //   const defaultEndDate = useMemo(() => today, [today]);


// //   function shiftDate(date: Date, numDays: number) {
// //     const newDate = new Date(date);
// //     newDate.setDate(newDate.getDate() + numDays);
// //     return newDate;
// //   }

// //   // Transform the quiz activities data for the heatmap
// //   const heatmapValues = useMemo(() => {
// //     return quizActivities.map((activity, index) => ({
// //       // date: new Date(activity.date),
// //       date: shiftDate(today, -index),
// //       count: index || activity.count,
// //       // quizzes: activity.quizzes || []
// //     }));
// //   }, [quizActivities]);

// //   const getTooltipDataAttrs = (value: any): TooltipDataAttrs => {
// //     if (!value || value.count === 0) {
// //       return {
// //         'data-tip': `${value?.date?.toISOString().slice(0, 10) || 'No date'}: No quiz activity`
// //       } as TooltipDataAttrs;
// //     }

// //     const dateStr = value.date.toISOString().slice(0, 10);
// //     const quizText = value.count === 1 ? 'quiz' : 'quizzes';
// //     let tooltip = `${dateStr}: ${value.count} ${quizText} completed`;
    
// //     if (value.quizzes && value.quizzes.length > 0) {
// //       tooltip += `\n${value.quizzes.join(', ')}`;
// //     }
    
// //     return { 'data-tip': tooltip } as TooltipDataAttrs;
// //   };

// //   // Determine CSS class based on activity level
// //   const getClassForValue = (value: any) => {
// //     if (!value || value.count === 0) {
// //       return 'color-empty';
// //     }
    
// //     // Customize these thresholds based on your needs
// //     if (value.count >= 5) return 'color-github-4'; // Very active
// //     if (value.count >= 3) return 'color-github-3'; // Active
// //     if (value.count >= 2) return 'color-github-2'; // Moderate
// //     return 'color-github-1'; // Light activity
// //   };

// //   const handleClick = (value: any) => {
// //     if (onDateClick) {
// //       onDateClick(value);
// //     } else if (value && value.count > 0) {
// //       // Default behavior: show alert with details
// //       const dateStr = value.date.toISOString().slice(0, 10);
// //       alert(`${dateStr}: ${value.count} quiz(es) completed`);
// //     }
// //   };

// //   return (
// //     <div className="dashboard-heatmap">
// //       <div className="mb-2">
// //         <h3 className="text-md font-semibold text-gray-900 mb-1">
// //           Quiz Activity Heatmap
// //         </h3>
// //       </div>
      
// //       <div className="heatmap-container bg-white p-4 rounded-lg border">
// //         <CalendarHeatmap
// //           startDate={startDate || defaultStartDate}
// //           endDate={endDate || defaultEndDate}
// //           values={heatmapValues}
// //           tooltipDataAttrs={getTooltipDataAttrs}
// //           // classForValue={getClassForValue}
// //           // tooltipDataAttrs={getTooltipDataAttrs}
// //           showWeekdayLabels={true}
// //           showMonthLabels={true}
// //           onClick={handleClick}
// //           gutterSize={2}
// //           horizontal={true}
// //           classForValue={value => {
// //             if (!value) {
// //               return 'color-empty';
// //             }
// //             return `color-github-${value.count}`;
// //           }}
          
// //         />
// //       </div>
      
// //       {/* Legend */}
// //       <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
// //         <span>Less</span>
// //         <div className="flex items-center space-x-1">
// //           <div className="w-3 h-3 rounded-sm bg-gray-100 border color-empty"></div>
// //           <div className="w-3 h-3 rounded-sm color-github-1"></div>
// //           <div className="w-3 h-3 rounded-sm color-github-2"></div>
// //           <div className="w-3 h-3 rounded-sm color-github-3"></div>
// //           <div className="w-3 h-3 rounded-sm color-github-4"></div>
// //         </div>
// //         <span>More</span>
// //       </div>
// //     </div>
// //   );
// // };

// // export default DashboardHeatmap;




// function DashboardHeatmap() {
//   const today = new Date();

//   function shiftDate(date, numDays) {
//     const newDate = new Date(date);
//     newDate.setDate(newDate.getDate() + numDays);
//     return newDate;
//   }

//   function getRange(count) {
//     return Array.from({ length: count }, (_, i) => i);
//   }

//   function getRandomInt(min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
//   }

//   const randomValues = getRange(200).map(index => {
//     return {
//       date: shiftDate(today, -index),
//       count: getRandomInt(1, 3),
//     };
//   });

//   return (
//     <div >
//       <h1>Activity Heatmap</h1>
//       <CalendarHeatmap
//         startDate={shiftDate(today, -150)}
//         endDate={today}
//         values={randomValues}
//         classForValue={value => {
//           if (!value) {
//             return 'color-empty';
//           }
//           return `color-github-${value.count}`;
//         }}
//         tooltipDataAttrs={value => {
//           return {
//             'data-tip': `${value.date.toISOString().slice(0, 10)} has count: ${
//               value.count
//             }`,
//           };
//         }}
//         showWeekdayLabels={true}
//         onClick={value => alert(`Clicked on value with count: ${value.count}`)}
//       />
//       {/* <ReactTooltip /> */}
//     </div>
//   );
// }




// export default DashboardHeatmap;