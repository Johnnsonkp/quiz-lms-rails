// import React, { useState } from 'react';

// import { DashboardHome } from '../dashboard/DashboardHome';
// import { QuizPreview } from '../../types/dashboard';
// import SideNav from "../components/aside/SideNav";
// import { getSelectedTopic } from '../../api/quiz';
// import { slugify } from '../../utils/slugify';
// import { usePage } from "@inertiajs/react"

// function DashboardLayout({children}: {children: React.ReactNode}) {
//   const categories = usePage().props.categories;
//   const currentUser = usePage().props.current_user;
//   const [quiz_preview, setQuizPreview] = useState<QuizPreview[] | null>([]);
//   const user = usePage().props.user;
//   const dashboard_stats = usePage().props.dashboard_stats;

//   const handleTopicClick = async (topicName: string) => {
//     if (!topicName) return;
    
//     const data: any = await getSelectedTopic(topicName);
//     if(data && data?.quiz_preview) {
//       setQuizPreview(data?.quiz_preview);
//     }
//     window.history.pushState({}, '', `/dashboard/${slugify(topicName)}`);
//   };

//   return (
//     <div>
//       <SideNav 
//         categories={categories}
//         handleTopicClick={handleTopicClick}
//         // activeSection={activeSection}
//         // showSidebar={showSidebar}
//       />
//       <main>
//         {children ? children : 
//           <DashboardHome 
//             dashboard_stats={dashboard_stats} 
//             user={user}   
//           />}
//       </main>

//     </div>
//   )
// }

// export default DashboardLayout