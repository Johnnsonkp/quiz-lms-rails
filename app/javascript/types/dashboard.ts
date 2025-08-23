// Interface for individual category
export interface Category {
  topic: string;
  description: string;
}

// Interface for individual quiz preview
export interface QuizPreview {
  topic: string;
  subject: string;
  titles: string[];
  description: string[];
  img: string | null;
  tag?: string[] | string | any;
}

// Main props interface for the Dashboard component
export interface DashboardProps {
  categories: Category[];
  quiz_preview: QuizPreview[];
}

// Question props
export interface QuestionOptionsProps {
  question: {
    id: number;
    question: string;
    answer: string;
    incorrect_answers: string[];
  };
  showResult: boolean;
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
}

export interface SingleQuestionCardProps {
  question: {
    id: number;
    question: string;
    answer: string;
    explanation: string | null;
    tags: string[] | null;
    incorrect_answers: string[];
    image: string | null;
  };
  showResult: boolean;
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  questionNumber: number;
  totalQuestions: number;
  hint: string;
}

export interface SubjectCardProps {
  titles: string[];
  subject: string;
  onSubjectClick: (subject: string) => void;
  subjectImg: string | null;
  tag: string | null;
  description: string[];
  topic: string;
}