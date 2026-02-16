import { UserI } from "../../types/userTypes";

export const handleStudyHoursSubmit = async (
  date: string, 
  hours: number, 
  user: UserI | null, 
  setIsSubmitting: (value: boolean) => void, 
  setRefreshTrigger: (value: boolean) => void,
) => {
    if (!user) {
      alert('Please log in to track study hours');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/dashboard/study_hours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          study_hour: {
            date: date,
            hours: hours
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Study hours saved:', data);
      // setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(true);
      alert(`Successfully logged ${hours} hours of study for ${date}`);
      
    } catch (error) {
      console.error('Error saving study hours:', error);
      alert(`Failed to save study hours: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error; // Re-throw so the form can handle it
    } finally {
      setIsSubmitting(false);
      setRefreshTrigger(false);
    }
};