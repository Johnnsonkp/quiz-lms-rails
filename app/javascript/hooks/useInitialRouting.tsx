import React from 'react'

function useInitialRouting(
  {
    url_params, 
    setSelectedTopic, 
    setActiveSection, 
    getSelectedTopic, 
    setLoadingQuizPreview, 
    setQuizPreview
  }: any) {
  React.useEffect(() => {
    const handleInitialRouting = async () => {
      if (!url_params || url_params === '/dashboard') return;
      
      try {
        const topicName = url_params
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (char: string) => char.toUpperCase());
        
        console.log("Initializing topic from URL:", topicName);
        setSelectedTopic(topicName);
        setActiveSection(topicName);
        
        // Fetch topic data
        setLoadingQuizPreview(true);
        const data: any = await getSelectedTopic(topicName);
        if(data && data?.quiz_preview) {
          setQuizPreview(data?.quiz_preview);
          setLoadingQuizPreview(false);
        }
      } catch (error) {
        console.error("Error during page refresh routing:", error);
        setSelectedTopic(null);
        setActiveSection('dashboard');
      }
    };
    handleInitialRouting();
  }, [url_params])
}

export default useInitialRouting