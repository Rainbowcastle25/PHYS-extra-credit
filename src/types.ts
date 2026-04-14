export interface TopicCheckpoint {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface TopicExample {
  prompt: string;
  steps: string[];
  answer: string;
}

export interface StudyTopic {
  id: string;
  title: string;
  summary: string;
  formulas: string[];
  mistakes: string[];
  example: TopicExample;
  checkpoint: TopicCheckpoint;
}

export interface FormulaItem {
  topic: string;
  name: string;
  expression: string;
  note: string;
}

export interface PracticeQuestion {
  id: string;
  topic: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

export interface Flashcard {
  id: string;
  topic: string;
  front: string;
  back: string;
}
