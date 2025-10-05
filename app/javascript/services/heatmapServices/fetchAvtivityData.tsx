export const fetchHeatmapActivityData = async ({params}: any) => {
  try {
    const response = await fetch(`/dashboard/study_activity?${params}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching activity data:', error);
  }
};


export const fetchStudyHeatmapActivityData = async ({params}: any) => {
  try {
    const response = await fetch(`/dashboard/study_hours_data?${params}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching activity data:', error);
  }
}