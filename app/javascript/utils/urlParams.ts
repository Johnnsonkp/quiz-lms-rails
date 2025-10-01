export const handleURLParams = (subject: string | null, quizIds: number[] | null, selectedTopic: string | null) => {
    if(!subject && !quizIds) return;
    const url = new URL(window.location.origin);
    url.pathname = '/dashboard';
    url.searchParams.set('topic', selectedTopic || '');
    url.searchParams.set('subject', subject || '');
    url.searchParams.set('quiz_ids', quizIds ? quizIds.join(',') : '');
    window.history.pushState({}, '', url);
}