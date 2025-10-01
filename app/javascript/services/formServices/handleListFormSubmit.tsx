import { useCallback, useState } from 'react';

export const handleListFormSubmit = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);


    const updateQuizListItem = useCallback(async (formData: { id:number | null, title: string; subject: string }) => {
      if (!formData?.id) return;
      setLoading(true);

      try {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        const response = await fetch('/dashboard/update_quiz_list', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-Token': csrfToken || ''
          },
          body: JSON.stringify({
            quiz_id: formData.id,
            quiz_title: formData.title,
            quiz_subject: formData.subject,
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data?.status === 200) {
          window.location.reload();
        }
      } catch (error) {
        console.error('Error updating quiz:', error);
        setError('Failed to update quiz');
      } finally {
        setLoading(false);
      }

    }, []);

    return { loading, error, updateQuizListItem };
  };