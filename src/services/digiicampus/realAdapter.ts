import { DigiicampusAdapter } from './adapter';
import { Semester, Course, Module, ModuleContent, DigiicampusSessionStatus } from '../../types';

export class RealDigiicampusAdapter implements DigiicampusAdapter {

  private async getActiveDigiiTab(): Promise<chrome.tabs.Tab | null> {
    if (typeof chrome === 'undefined' || !chrome.tabs) return null;

    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs.length === 0) return null;

    const currentTab = tabs[0];
    if (currentTab.url && (currentTab.url.includes('digiicampus') || currentTab.title?.toLowerCase().includes('digiicampus'))) {
      return currentTab;
    }

    // Try finding any opened Digiicampus tab in current window
    const allDigiiTabs = await chrome.tabs.query({ currentWindow: true });
    const digiiTab = allDigiiTabs.find(t => t.url?.includes('digiicampus'));
    return digiiTab || null;
  }

  private async sendMessageToTab(tabId: number, action: string, payload?: any): Promise<any> {
    try {
      const response = await chrome.tabs.sendMessage(tabId, { action, payload });
      return response;
    } catch (err) {
      console.warn(`[RealDigiicampusAdapter] Message sending to tab ${tabId} failed:`, err);
      // Try injecting content script dynamically if missing
      try {
        await chrome.scripting.executeScript({
          target: { tabId },
          files: ['src/content/digiiContentScript.ts']
        });
        return await chrome.tabs.sendMessage(tabId, { action, payload });
      } catch (injectionErr) {
        console.error('[RealDigiicampusAdapter] Dynamic injection failed:', injectionErr);
        throw new Error('Could not communicate with Digiicampus webpage script.');
      }
    }
  }

  async detectSession(): Promise<DigiicampusSessionStatus> {
    const tab = await this.getActiveDigiiTab();
    if (!tab || !tab.id) {
      return {
        isConnected: false,
        lastChecked: Date.now(),
        errorMessage: 'Digiicampus tab not open in active browser window.'
      };
    }

    try {
      const res = await this.sendMessageToTab(tab.id, 'DETECT_SESSION');
      if (res && res.success) {
        return res.status;
      }
    } catch (e) {
      // Fallback response when tab exists
    }

    return {
      isConnected: false,
      lastChecked: Date.now(),
      errorMessage: 'Could not detect active Digiicampus session.'
    };
  }

  async getSemesters(): Promise<Semester[]> {
    const tab = await this.getActiveDigiiTab();
    if (!tab || !tab.id) return [];

    try {
      const res = await this.sendMessageToTab(tab.id, 'GET_SEMESTERS');
      if (res && res.success && Array.isArray(res.semesters)) {
        return res.semesters;
      }
    } catch (e) {
      console.error('[RealDigiicampusAdapter] Error fetching semesters:', e);
    }
    return [];
  }

  async getCurrentSemester(): Promise<Semester | null> {
    const semesters = await this.getSemesters();
    return semesters.find(s => s.isCurrent) || (semesters.length > 0 ? semesters[0] : null);
  }

  async getCourses(semesterId: string): Promise<Course[]> {
    const tab = await this.getActiveDigiiTab();
    if (!tab || !tab.id) return [];

    try {
      const res = await this.sendMessageToTab(tab.id, 'GET_COURSES', { semesterId });
      if (res && res.success && Array.isArray(res.courses)) {
        return res.courses;
      }
    } catch (e) {
      console.error('[RealDigiicampusAdapter] Error fetching courses:', e);
    }
    return [];
  }

  async getModules(courseId: string): Promise<Module[]> {
    const courses = await this.getCourses('');
    const course = courses.find(c => c.id === courseId);
    return course ? course.modules : [];
  }

  async getModuleContent(courseId: string, moduleId: string): Promise<ModuleContent> {
    const tab = await this.getActiveDigiiTab();
    if (!tab || !tab.id) {
      throw new Error('Digiicampus session page not accessible.');
    }

    const courses = await this.getCourses('');
    const course = courses.find(c => c.id === courseId);
    const module = course?.modules.find(m => m.id === moduleId);

    const res = await this.sendMessageToTab(tab.id, 'GET_MODULE_CONTENT', {
      courseName: course?.name,
      moduleTitle: module?.title
    });

    if (res && res.success && res.content) {
      return {
        courseId,
        courseName: course?.name || 'Course Materials',
        moduleId,
        moduleName: module?.title || 'Module Content',
        topics: res.content.topics || [],
        lessonText: res.content.text || '',
        resources: res.content.resources || []
      };
    }

    throw new Error('Unable to extract content from Digiicampus page.');
  }
}
