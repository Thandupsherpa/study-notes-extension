import { ExtensionSettings, DigiicampusSessionStatus, Semester, Course } from '../types';

const SETTINGS_KEY = 'digii_assistant_settings';
const SESSION_STATUS_KEY = 'digii_session_status';
const CACHED_SEMESTERS_KEY = 'digii_cached_semesters';
const CACHED_COURSES_KEY = 'digii_cached_courses';
const SELECTED_SEMESTER_KEY = 'digii_selected_semester_id';

export const DEFAULT_SETTINGS: ExtensionSettings = {
  noteType: 'detailed',
  language: 'en',
  autoDownload: true,
  includeExamQuestions: true,
  includeExamples: true,
  theme: 'light',
  useMockData: false, // Default to real integration with mock fallback
  backendUrl: 'http://localhost:3000',
  customApiKey: ''
};

function hasChromeStorage(): boolean {
  return typeof chrome !== 'undefined' && !!chrome.storage?.local;
}

export const storageService = {
  async getSettings(): Promise<ExtensionSettings> {
    if (hasChromeStorage()) {
      return new Promise((resolve) => {
        chrome.storage.local.get([SETTINGS_KEY], (result) => {
          resolve({ ...DEFAULT_SETTINGS, ...(result[SETTINGS_KEY] || {}) });
        });
      });
    } else {
      const stored = localStorage.getItem(SETTINGS_KEY);
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    }
  },

  async saveSettings(settings: Partial<ExtensionSettings>): Promise<ExtensionSettings> {
    const current = await this.getSettings();
    const updated = { ...current, ...settings };
    if (hasChromeStorage()) {
      await new Promise<void>((resolve) => {
        chrome.storage.local.set({ [SETTINGS_KEY]: updated }, () => resolve());
      });
    } else {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    }
    return updated;
  },

  async getSessionStatus(): Promise<DigiicampusSessionStatus | null> {
    if (hasChromeStorage()) {
      return new Promise((resolve) => {
        chrome.storage.local.get([SESSION_STATUS_KEY], (result) => {
          resolve(result[SESSION_STATUS_KEY] || null);
        });
      });
    } else {
      const stored = localStorage.getItem(SESSION_STATUS_KEY);
      return stored ? JSON.parse(stored) : null;
    }
  },

  async saveSessionStatus(status: DigiicampusSessionStatus): Promise<void> {
    if (hasChromeStorage()) {
      await new Promise<void>((resolve) => {
        chrome.storage.local.set({ [SESSION_STATUS_KEY]: status }, () => resolve());
      });
    } else {
      localStorage.setItem(SESSION_STATUS_KEY, JSON.stringify(status));
    }
  },

  async getCachedSemesters(): Promise<Semester[] | null> {
    if (hasChromeStorage()) {
      return new Promise((resolve) => {
        chrome.storage.local.get([CACHED_SEMESTERS_KEY], (result) => {
          resolve(result[CACHED_SEMESTERS_KEY] || null);
        });
      });
    } else {
      const stored = localStorage.getItem(CACHED_SEMESTERS_KEY);
      return stored ? JSON.parse(stored) : null;
    }
  },

  async saveCachedSemesters(semesters: Semester[]): Promise<void> {
    if (hasChromeStorage()) {
      await new Promise<void>((resolve) => {
        chrome.storage.local.set({ [CACHED_SEMESTERS_KEY]: semesters }, () => resolve());
      });
    } else {
      localStorage.setItem(CACHED_SEMESTERS_KEY, JSON.stringify(semesters));
    }
  },

  async getCachedCourses(semesterId?: string): Promise<Course[] | null> {
    if (hasChromeStorage()) {
      return new Promise((resolve) => {
        chrome.storage.local.get([CACHED_COURSES_KEY], (result) => {
          const allCourses: Course[] = result[CACHED_COURSES_KEY] || [];
          if (!semesterId) resolve(allCourses);
          resolve(allCourses.filter(c => c.semesterId === semesterId));
        });
      });
    } else {
      const stored = localStorage.getItem(CACHED_COURSES_KEY);
      if (!stored) return null;
      const allCourses: Course[] = JSON.parse(stored);
      if (!semesterId) return allCourses;
      return allCourses.filter(c => c.semesterId === semesterId);
    }
  },

  async saveCachedCourses(courses: Course[]): Promise<void> {
    if (hasChromeStorage()) {
      await new Promise<void>((resolve) => {
        chrome.storage.local.set({ [CACHED_COURSES_KEY]: courses }, () => resolve());
      });
    } else {
      localStorage.setItem(CACHED_COURSES_KEY, JSON.stringify(courses));
    }
  },

  async getSelectedSemesterId(): Promise<string | null> {
    if (hasChromeStorage()) {
      return new Promise((resolve) => {
        chrome.storage.local.get([SELECTED_SEMESTER_KEY], (result) => {
          resolve(result[SELECTED_SEMESTER_KEY] || null);
        });
      });
    } else {
      return localStorage.getItem(SELECTED_SEMESTER_KEY);
    }
  },

  async saveSelectedSemesterId(semesterId: string): Promise<void> {
    if (hasChromeStorage()) {
      await new Promise<void>((resolve) => {
        chrome.storage.local.set({ [SELECTED_SEMESTER_KEY]: semesterId }, () => resolve());
      });
    } else {
      localStorage.setItem(SELECTED_SEMESTER_KEY, semesterId);
    }
  },

  async clearAllData(): Promise<void> {
    if (hasChromeStorage()) {
      await new Promise<void>((resolve) => {
        chrome.storage.local.clear(() => resolve());
      });
    } else {
      localStorage.clear();
    }
  }
};
