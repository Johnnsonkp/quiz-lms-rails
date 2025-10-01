import {QuizPreview} from '../../types/dashboard';

function NoAvailableTopics({quiz_preview, selectedTopic}: {quiz_preview: QuizPreview[], selectedTopic: string | null}) {
  return (
    <>
      {quiz_preview && quiz_preview.filter((quiz: QuizPreview) => quiz.topic === selectedTopic).length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No subjects available for this topic.</p>
        </div>)}
    </>
  )
}

export default NoAvailableTopics