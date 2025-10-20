import HintButton from '../buttons/HintButton';
import NoteSideDrawer from '../ui/NoteSideDrawer';
import QuestionOptions from './QuestionOptions';
import SingleCardControls2 from '../controls/SingleCardControls2';
import { SingleQuestionCardProps } from '../../../types/dashboard';
import ViewNoteBtn from '../ui/ViewNote';
import { useState } from 'react';

export function SingleQuestionCard({ 
  question, 
  selectedAnswer, 
  onAnswerSelect, 
  showResult,
  questionNumber,
  totalQuestions,
  hint,
  answers,
  showResults,
  currentQuestionIndex,
  handlePrevious,
  handleNext,
  handleShowResult,
  handleReset,
  quizTitle,
  currentQuestion 
}: SingleQuestionCardProps) {

  // Note drawer state
  const [showNoteDrawer, setShowNoteDrawer] = useState(false);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [noteLoading, setNoteLoading] = useState(false);
  
  // Blur options state
  const [optionsBlurred, setOptionsBlurred] = useState(true);

  const toggleOptionsBlur = () => {
    setOptionsBlurred(!optionsBlurred);
  };

  // Function to fetch note from backend and open drawer
  const openNoteDrawer = async () => {
    if (!quizTitle) {
      console.error('Quiz title not available');
      return;
    }

    setShowNoteDrawer(true);
    setNoteLoading(true);
    setSelectedNote(null);

    try {
      const response = await fetch(`/dashboard/quiz/note?title=${encodeURIComponent(quizTitle)}`, {
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
      setSelectedNote(data.note || null);
    } catch (error) {
      console.error('Error fetching note:', error);
      setSelectedNote(null);
    } finally {
      setNoteLoading(false);
    }
  };

  const closeNoteDrawer = () => {
    setShowNoteDrawer(false);
    setSelectedNote(null);
  };

  const defaultImage = "https://images.unsplash.com/photo-1546514714-df0ccc50d7bf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80";

  return (
    <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
      {/* Image section */}
      <div 
        className="hidden lg:block lg:w-1/4 bg-cover"
        style={{ backgroundImage: `url(${question?.image || defaultImage})`}}
      >
      </div>

      {/* Quiz card */}
      <div className="bg-white p-4 rounded-lg shadow-lg border-none max-w-4xl mx-auto lg:w-3/4">
        {/* Question Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500 uppercase tracking-wide">
              Question {questionNumber} of {totalQuestions}
            </span>
            <span className="text-sm text-blue-400 font-medium">ID: {question.id}</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 leading-relaxed">
            {question.question}
          </h2>
        </div>

        {/* Answer Options */}
        <QuestionOptions 
          question={question}
          showResult={showResult}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={onAnswerSelect}
          optionsBlurred={optionsBlurred}
        />

        <div className=''>
          <div className='flex align-middle mb-6 mt-4 gap-2'>
            {hint && (<HintButton hint={hint}/>)}
            {quizTitle && (<ViewNoteBtn onClick={openNoteDrawer} />)}
            
            {/* Blur/Reveal Options Button */}
            <button
              onClick={toggleOptionsBlur}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                optionsBlurred 
                  ? 'bg-green-50 hover:bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200'
              }`}
            >
              {optionsBlurred ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Reveal Options
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878L21 21M14.12 14.12l2.122 2.122M14.12 14.12L21 21" />
                  </svg>
                  Hide Options
                </>
              )}
            </button>
          </div>

          <hr className='border-gray-200'></hr>

          <SingleCardControls2 
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
            answers={answers}
            showResults={showResults}
            handlePrevious={handlePrevious}
            handleNext={handleNext}
            handleShowResult={handleShowResult}
            handleReset={handleReset}
            currentQuestion={currentQuestion}
          />
        </div>


        {/* Question Details */}
        {showResult && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="mb-2">
              <span className="font-medium text-gray-700">Correct Answer:</span>
              <span className="ml-2 text-gray-800">{question.answer}</span>
            </div>
            {question.explanation && (
              <div className="mb-2">
                <span className="font-medium text-gray-700">Explanation:</span>
                <span className="ml-2 text-gray-800">{question.explanation}</span>
              </div>
            )}
            {question.tags && question.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                <span className="text-sm text-gray-600">Tags:</span>
                {question.tags.map((tag: string) => (
                  <span key={tag} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Note Side Drawer */}
      <NoteSideDrawer
        isOpen={showNoteDrawer}
        onClose={closeNoteDrawer}
        note={selectedNote}
        quizTitle={quizTitle || 'Quiz Note'}
        loading={noteLoading}
      />
    </div>
  );
}