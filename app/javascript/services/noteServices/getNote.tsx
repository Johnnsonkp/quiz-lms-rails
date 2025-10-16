async function getNote({title}: {title: string}): Promise<string | null> {
  try {
    const response = await fetch(`/dashboard/quiz/note?title=${encodeURIComponent(title)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.note || null;
    // Backend now returns the note content directly
  } catch (error) {
    console.error('Error fetching note:', error);
    return null;
  }
}

export default getNote