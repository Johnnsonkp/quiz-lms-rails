// Interface for individual category
export interface Category {
  topic: string;
  description: string;
}

export interface QuizDetails {
  title: string;
  external_ids: string[];
}

// Interface for individual quiz preview
export interface QuizPreview {
  ids: number[] | null;
  topic: string;
  subject: string;
  titles: string[];
  description: string[];
  quiz_details: QuizDetails[] | null;
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
  ids: number[] | null;
  titles: string[];
  subject: string;
  onSubjectClick: (subject: string, externalIds: string[] | null, quizIds: number[] | null) => void;
  subjectImg: string | null;
  tag: string | null;
  description: string[];
  topic: string;
  quiz_details: QuizDetails[] | null;
}