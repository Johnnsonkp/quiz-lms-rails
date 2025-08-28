import { useCallback, useEffect, useState } from "react";

import { QuizDetails } from "../types/dashboard";

export const useExternalIDs = (quiz_details: QuizDetails[] | null, topic: string) => {
  const [externalIds, setExternalIds] = useState<string[]>([]);
  // const [loading, setLoading] = useState<Boolean>(false);
  // const [error, setError] = useState<string | null>(null);

  const matchTopicSubjectWithExternal_ID = useCallback((a: string, b: string): boolean => {
    if (!a || !b) return false;

    const normalize = (str: string) => str.toLowerCase().trim();
    const val1 = normalize(a);
    const val2 = normalize(b);
    return (
      val1 === val2 ||
      val1.includes(val2) ||
      val2.includes(val1)
    );
  }, []);

  const getExternalIDs: any = (quiz_details: QuizDetails[] | null, topic: string) => {
    quiz_details && quiz_details.map((quiz: any) => {
      quiz?.external_ids.length > 0 && 
      quiz?.external_ids[0].toLowerCase().split("_")
      .forEach((id_name: any) => {
        if(matchTopicSubjectWithExternal_ID(id_name, topic)) {
          setExternalIds(quiz?.external_ids);
        }
      })
    })
  }

  // setLoading(true);
  // setError(null);
  useEffect(() => {
    if (quiz_details && topic) {
      getExternalIDs(quiz_details, topic);
    }
  }, [quiz_details, topic, getExternalIDs]);
  // return { externalIds, loading, error, getExternalIDs };
  return { externalIds };
};