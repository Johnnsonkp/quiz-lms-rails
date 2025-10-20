interface NoteSideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  note: string | null;
  quizTitle: string;
  loading: boolean;
  keyConcepts?: Record<string, string>;
}

import React, { useEffect, useState } from "react";

import RichTextEditor from "../richTextEditor/RichTextEditor";
import Toast from "./Toast";

function NoteSideDrawer({ isOpen, onClose, note, quizTitle, loading, keyConcepts = {} }: NoteSideDrawerProps) {
  if (!isOpen) return null;

  const [updatedText, setUpdatedText] = React.useState<string>(note || '');
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [saveStatus, setSaveStatus] = React.useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [sliderSelected, setSliderSelected] = useState<'notes' | 'concepts'>('notes');
  const [keyConceptsData, setKeyConceptsData] = useState<Record<string, string>>(keyConcepts);
  // const [newConcept, setNewConcept] = useState<{ key: string; value: string }>({ key: '', value: '' });


  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false
  });

  const onSubmit = async () => {
    if(!updatedText) return;
    const str = updatedText.trim();
    console.log("Submitted note:", str);
    
    try {
      setIsSubmitting(true);
      setSaveStatus('idle');
      setErrorMessage('');
      
      const response = await fetch('/dashboard/update_quiz_note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          quiz_title: quizTitle,
          note_content: str,
          // key_concepts: keyConceptsData
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Note updated successfully:', result);
      setSaveStatus('success');

      setToast({
        message: 'Note updated successfully!',
        type: 'success',
        isVisible: true
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
      
    } catch (error) {
      console.error('Error updating note:', error);
      setSaveStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save note');
    } finally {
      setIsSubmitting(false);
    }
  }

  // Key concepts management functions
  // const addKeyConcept = () => {
  //   if (newConcept.key.trim() && newConcept.value.trim()) {
  //     setKeyConceptsData(prev => ({
  //       ...prev,
  //       [newConcept.key.trim()]: newConcept.value.trim()
  //     }));
  //     setNewConcept({ key: '', value: '' });
  //   }
  // };

  // const removeKeyConcept = (conceptKey: string) => {
  //   setKeyConceptsData(prev => {
  //     const updated = { ...prev };
  //     delete updated[conceptKey];
  //     return updated;
  //   });
  // };

  // const updateKeyConcept = (oldKey: string, newKey: string, newValue: string) => {
  //   setKeyConceptsData(prev => {
  //     const updated = { ...prev };
  //     delete updated[oldKey];
  //     if (newKey.trim() && newValue.trim()) {
  //       updated[newKey.trim()] = newValue.trim();
  //     }
  //     return updated;
  //   });
  // };
  
  useEffect(() => {
    // console.log("isSubmitting keyConceptsData:", keyConceptsData);
    if (isSubmitting){
      onSubmit();
    }
  }, [isSubmitting])

  useEffect(() => {
    console.log("isSubmitting keyConceptsData:", keyConceptsData);
    console.log("keyConceptsData updated", keyConcepts);
    if (keyConcepts){
      setKeyConceptsData(keyConcepts); 
    }
  }, [keyConceptsData, keyConcepts])


  const handleToastClose = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };


  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-900/50 bg-opacity-50 z-40" 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`
        fixed top-0 right-0 z-50 h-full w-180 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex-col items-center justify-between p-4 border-b border-gray-200">

          <div className="flex w-full justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Quiz Note</h2>
              <p className="text-lg text-gray-500">{quizTitle}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex items-center relative mt-4 w-45 bg-gray-300 h-[30px] rounded-sm px-5 overflow-hidden">
            {/* Sliding indicator */}
            <div
              aria-hidden="true"
              className="absolute h-[24px] mt-1 z-0 top-0 left-0 w-1/2 bg-black rounded-sm transform transition-transform duration-200 ease-in-out peer-checked:translate-x-full"
              style={{ transform: sliderSelected === 'notes' ? 'translateX(0)' : 'translateX(100%)' }}
            />

            {/* Labels that act as buttons */}
              <div className="cursor-pointer w-1/2 text-center text-sm font-medium z-10 select-none
                           text-white transition-colors duration-150 items-start"
                onClick={() => setSliderSelected('notes')}
              >
                Notes
              </div>

              {/* <div className="w-1/3"></div> */}

              <div className="cursor-pointer w-1/2 text-center text-sm font-medium z-10 select-none
                           text-white transition-colors duration-150 items-end"
                onClick={() => setSliderSelected('concepts')}
              >
                Concepts
              </div>
          </div>

        </div>
        
        {/* Content */}
        <div className="p-4 h-full overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : note && sliderSelected ? (
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                <RichTextEditor
                  initialText={sliderSelected === 'notes' ? note : keyConcepts}
                  placeholder={"Enter your note here..."}
                  onChange={(newText) => setUpdatedText(newText)}
                  onSubmit={setIsSubmitting}
                /> 
              </div>
            </div>)
           : (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>No note available for this quiz</p>
            </div>
          )}
        </div>
        
        {/* Footer (optional) */}
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>


    {/* Toast Notification */}
    <Toast
      message={toast.message}
      type={toast.type}
      isVisible={toast.isVisible}
      onClose={handleToastClose}
    />
    </>
  );
}

export default NoteSideDrawer;