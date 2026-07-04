export interface VocabCard {
  id: string;
  word: string;
  tibetanScript?: string;
  persoArabicScript?: string;
  ipa: string;
  meaning: string;
  urduMeaning?: string;
  category: string;
  dialect: 'balti' | 'purigi' | 'both';
  notes?: string;
  exampleSentence?: string;
  exampleTranslation?: string;
}

export interface LessonStep {
  id: string;
  type: 'content' | 'vocab' | 'quiz' | 'phonetic';
  title: string;
  text?: string;
  audioText?: string; // used for pronunciation guide simulation
  vocabItems?: VocabCard[];
  quizQuestion?: string;
  quizOptions?: string[];
  quizAnswer?: number;
  quizExplanation?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  category: 'basics' | 'conversations' | 'grammar' | 'phonology';
  dialect: 'balti' | 'purigi' | 'both';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  points: number;
  steps: LessonStep[];
}

export interface DictionaryEntry {
  id: string;
  word: string;
  tibetanScript?: string;
  persoArabicScript?: string;
  ipa: string;
  meaning: string;
  urduMeaning?: string;
  partOfSpeech: string;
  dialect: 'balti' | 'purigi' | 'common';
  definition: string;
  exampleSentence?: string;
  exampleTranslation?: string;
  etymology?: string;
}

export interface CommunityTranslation {
  id: string;
  sourceText: string;
  targetDialect: 'balti' | 'purigi';
  translation?: string;
  phoneticBreakdown?: string;
  grammarNotes?: string;
  author: string;
  timestamp: string;
  upvotes: number;
  isAiAssisted?: boolean;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  points: number;
  streak: number;
  rank: number;
  isCurrentUser?: boolean;
}

export interface UserProgress {
  completedLessons: string[];
  completedSteps: { [lessonId: string]: number }; // tracks current step index
  bookmarks: string[]; // dictionary entry IDs or lesson IDs
  streak: number;
  lastActiveDate?: string;
  points: number;
  badges: string[]; // Badge IDs
  name: string;
  avatar: string;
  dialectPreference: 'balti' | 'purigi' | 'both';
  level: number;
  isPro?: boolean;
  dailyGoalMinutes?: number;
}

export interface ExternalCourse {
  id: string;
  title: string;
  provider: 'Coursera' | 'Khan Academy' | 'Linguistic Society';
  description: string;
  url: string;
  tags: string[];
  duration?: string;
  level: string;
}
