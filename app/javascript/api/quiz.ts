export const getSelectedTopic = async (topic: string) => {
    // setLoadingQuizPreview(true);

    try {
      const response = await fetch(`/dashboard/${encodeURIComponent(topic)}/get`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error("Error fetching topic data:", error);
    } 
}


export const deleteQuizData = async (
    ids: (number | undefined)[] | null,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (!ids || ids.length === 0) return;

    // Filter out undefined and convert to string
    const quizIds = ids.filter((id): id is number => id !== undefined);
    if (quizIds.length === 0) return;
    console.log("Deleting quiz with IDs:", quizIds);

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      const response = await fetch(`/dashboard/delete_quiz`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-Token': csrfToken || ''
        },
        body: JSON.stringify({ quiz_ids: quizIds }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Quiz deleted successfully:", data);

    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  }