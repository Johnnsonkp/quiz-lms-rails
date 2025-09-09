// Interface for individual category
export interface Category {
  topic: string;
  description: string;
}

export interface QuizDetails {
  id?: number;
  title: string;
  description?: string;
  external_ids: string[];
}

// Interface for individual quiz preview
export interface QuizPreview {
  ids: number[] | null;
  topic: string | null;
  subject: string | null;
  titles: string[] | null;
  description: string[] | null;
  quiz_details: QuizDetails[] | null;
  img: string | null;
  tag?: string[] | string | any;
}

export interface DashboardStats {
  total_quizzes: number;
  total_questions: number;
  total_topics: number;
  total_subjects: number;
}

// Main props interface for the Dashboard component
export interface DashboardProps {
  categories: Category[];
  quiz_preview: QuizPreview[];
  dashboard_stats: DashboardStats;
  url_params: string | null;
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
  ids: (number | undefined)[] | null;
  titles: string[];
  subject: string | null;
  onSubjectClick: (subject: string | null, externalIds: string[] | null, quizIds: number[] | null) => void;
  subjectImg: string | null;
  tag: string | null;
  description: string | null;
  topic: string | null;
  quiz_details: QuizDetails[] | null;
  editStatus: boolean;
  deleteQuizData: (ids: (number | undefined)[] | null, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}