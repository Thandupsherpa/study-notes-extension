export interface TranslationDictionary {
  appTitle: string;
  appSubtitle: string;
  connectedStatus: string;
  disconnectedStatus: string;
  openDigiicampus: string;
  loginExplanation: string;
  currentSemester: string;
  coursesTitle: string;
  searchPlaceholder: string;
  generateNotes: string;
  simpleNotes: string;
  detailedNotes: string;
  resourcesCount: (count: number) => string;
  loadingCourses: string;
  refreshCourses: string;
  clearCachedData: string;
  settings: string;
  privacy: string;
  devMode: string;
  devModeDesc: string;
  collectingContent: string;
  analyzingMaterial: string;
  creatingNotes: string;
  formattingPdf: string;
  downloadingPdf: string;
  generationComplete: string;
  errorTitle: string;
  retry: string;
  close: string;
  backendUrl: string;
  saveSettings: string;
  savedSuccessfully: string;
}

const en: TranslationDictionary = {
  appTitle: "Study Notes",
  appSubtitle: "Your Digiicampus Learning Assistant",
  connectedStatus: "Connected to Digiicampus",
  disconnectedStatus: "Digiicampus session not detected.",
  openDigiicampus: "Open Digiicampus",
  loginExplanation: "Log in to Digiicampus in your browser and reopen this extension.",
  currentSemester: "Current Semester",
  coursesTitle: "Courses",
  searchPlaceholder: "Search courses or modules...",
  generateNotes: "Generate Notes",
  simpleNotes: "Simple Notes",
  detailedNotes: "Detailed Notes",
  resourcesCount: (count: number) => `${count} resource${count === 1 ? '' : 's'}`,
  loadingCourses: "Loading courses...",
  refreshCourses: "Refresh Courses",
  clearCachedData: "Clear Cached Data",
  settings: "Settings",
  privacy: "Privacy Policy",
  devMode: "Developer / Mock Mode",
  devModeDesc: "Use mock Digiicampus data for offline testing & UI preview",
  collectingContent: "Collecting module content...",
  analyzingMaterial: "Analyzing material with AI...",
  creatingNotes: "Creating structured study notes...",
  formattingPdf: "Formatting academic PDF document...",
  downloadingPdf: "Downloading PDF to your computer...",
  generationComplete: "Notes successfully downloaded!",
  errorTitle: "Couldn't load your courses",
  retry: "Retry",
  close: "Close",
  backendUrl: "AI Backend Service URL",
  saveSettings: "Save Settings",
  savedSuccessfully: "Settings saved successfully!"
};

export const translations: Record<string, TranslationDictionary> = {
  en
};

export function getTranslation(lang: string = 'en'): TranslationDictionary {
  return translations[lang] || translations.en;
}
