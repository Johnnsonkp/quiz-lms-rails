import { useEffect, useState } from "react";

interface UseURLRoutingParams {
  onTopicClick: (topic: string) => void;
  onSubjectClick: (subject: string | null, externalIds: string[] | null, quizIds: number[] | null) => Promise<void>;
  externalIds: string[] | null;
}

interface UseURLRoutingReturn {
  routeType: 'search' | 'path' | 'dashboard' | null;
  isRouting: boolean;
}

export const useURLRouting = ({ 
  onTopicClick, 
  onSubjectClick, 
  externalIds 
}: UseURLRoutingParams): UseURLRoutingReturn => {
  const [routeType, setRouteType] = useState<'search' | 'path' | 'dashboard' | null>(null);
  const [isRouting, setIsRouting] = useState(false);

  useEffect(() => {
    console.log("useURLRouting initialized")
    
    const handleURLRouting = async () => {
      setIsRouting(true);
      
      // Your existing URL parsing logic here
      const pathname = window.location.pathname;
      const search = window.location.search;
      const pathSegments = pathname.split('/').filter(segment => segment !== '');
      
      const isSearchRoute = search.length > 0;
      const isPathRoute = pathSegments.length > 1;

      if (isSearchRoute) {
        setRouteType('search');
        // Extract and handle search parameters
        const urlParams = new URLSearchParams(search);
        const subject = urlParams.get('subject');
        const quizIds = urlParams.get('quiz_ids');
        const quizIdsArray = quizIds ? quizIds.split(',').map(id => parseInt(id)) : null;
        
        await onSubjectClick(subject, externalIds, quizIdsArray);
        
      } else if (isPathRoute && pathSegments.length >= 2) {
        setRouteType('path');
        // Extract and handle path parameters
        const topicSegment = pathSegments[1];
        const topicName = topicSegment.split('-').join(' ');
        
        onTopicClick(topicName);
      } else {
        setRouteType('dashboard');
      }
      
      setIsRouting(false);
    };

    // handleURLRouting();
    const handleBeforeUnload = (event: any) => {
      event.preventDefault();
      handleURLRouting();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
  // }, [onTopicClick, onSubjectClick, externalIds]);
  }, []);

  return { routeType, isRouting };
};