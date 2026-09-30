export type NoteType = 'simple' | 'detailed';

export interface Resource {
  id: string;
  title: string;
  type: 'document' | 'pdf' | 'link' | 'text' | 'description';
  url?: string;
  contentSnippet?: string;
  isAccessible: boolean;
}

export interface Module {
  id: string;
  courseId: string;
  number: number;
  title: string;
  description?: string;
  topics?: string[];
  resourceCount: number;
  resources: Resource[];
}

export interface Course {
  id: string;
  code: string;
  name: string;
  credits?: number;
  instructor?: string;
  semesterId: string;
  modules: Module[];
}

export interface Semester {
  id: string;
  name: string;
  isCurrent: boolean;
  year: string;
  term: string;
}

export interface ModuleContent {
  courseId: string;
  courseName: string;
  moduleId: string;
  moduleName: string;
  moduleDescription?: string;
  topics: string[];
  lessonText: string;
  resources: Resource[];
  warnings?: string[];
}

export interface DefinitionItem {
  term: string;
  definition: string;
}

export interface ComparisonItem {
  conceptA: string;
  conceptB: string;
  keyDifferences: string;
}

export interface QuestionItem {
  question: string;
  suggestedAnswer: string;
  marks?: number;
}

export interface GeneratedNotes {
  courseName: string;
  moduleTitle: string;
  noteType: NoteType;
  generatedAt: string;
  overview: string;
  learningObjectives: string[];
  keyConcepts: string[];
  detailedExplanations: Array<{
    heading: string;
    explanation: string;
    subpoints?: string[];
  }>;
  importantDefinitions: DefinitionItem[];
  stepByStepGuides?: Array<{
    title: string;
    steps: string[];
  }>;
  examples: Array<{
    title: string;
    problem: string;
    solution: string;
  }>;
  formulasAndEquations?: Array<{
    name: string;
    formula: string;
    explanation: string;
  }>;
  comparisons?: ComparisonItem[];
  commonMisconceptions?: Array<{
    misconception: string;
    fact: string;
  }>;
  practicalApplications: string[];
  quickRevisionPoints: string[];
  importantQuestions: QuestionItem[];
  examOrientedTips: string[];
}

export type GenerationStage = 
  | 'idle'
  | 'collecting'
  | 'analyzing'
  | 'generating'
  | 'formatting'
  | 'downloading'
  | 'complete'
  | 'error';

export interface GenerationProgress {
  stage: GenerationStage;
  message: string;
  percentage: number;
  error?: string;
}

export interface ExtensionSettings {
  noteType: NoteType;
  language: string;
  autoDownload: boolean;
  includeExamQuestions: boolean;
  includeExamples: boolean;
  theme: 'light' | 'dark' | 'system';
  useMockData: boolean;
  backendUrl: string;
  customApiKey?: string;
}

export interface DigiicampusSessionStatus {
  isConnected: boolean;
  studentName?: string;
  studentId?: string;
  activePortalUrl?: string;
  lastChecked: number;
  errorMessage?: string;
}
