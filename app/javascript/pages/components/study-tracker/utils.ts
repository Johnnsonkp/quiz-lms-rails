import { useMemo } from "react";

export const getAESTDate = () => {
  const now = new Date();
  const aestOffset = 10 * 60; // Base AEST offset in minutes
  const aestTime = new Date(now.getTime() + (aestOffset + now.getTimezoneOffset()) * 60000);
  return aestTime;
};

export const today = getAESTDate();
  
  // Default to showing last 6 months if no dates provided (using AEST)
export const defaultStartDate = useMemo(() => {
    const date = new Date(today);
    date.setMonth(date.getMonth() - 4);
    return date;
  }, [today]);

export const defaultEndDate = useMemo(() => {
    const date = new Date(today);
    date.setMonth(date.getMonth() + 3);
    return date;
}, [today]);