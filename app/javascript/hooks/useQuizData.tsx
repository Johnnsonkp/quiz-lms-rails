import { useCallback, useState } from "react";

import { QuizData } from "../types/quiz";

export const useQuizData = () => {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState<Boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchQuizData = useCallback(async (topic: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/dashboard/${topic}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setQuizData(data);
      return data;
    } catch (error) {
      console.error('Error fetching topic data:', error);
      setError('Failed to load quiz data');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return { quizData, loading, error, fetchQuizData };
};