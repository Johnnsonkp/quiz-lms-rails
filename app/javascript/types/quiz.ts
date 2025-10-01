export interface Question {
  id: string;
  type: string;
  question: string;
  answer: string; 
  incorrect_answers: string[];
  hint: string;
  explanation: string;
  difficulty: string;
  estimated_time_seconds: number;
  tags: string[];
  path: string;
  quiz_title: string;         
  subject: string;             
  image?: string;
}

export interface QuizData {
  topic: string;
  total_questions: number;
  questions: Question[];
  subject?: string;
  quiz_ids?: string;
  quiz_title?: string;
}