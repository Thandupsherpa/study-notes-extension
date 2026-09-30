import { storageService } from '../storage/storageService';
import { RealDigiicampusAdapter } from '../services/digiicampus/realAdapter';

console.log('[Background Service Worker] Digiicampus Study Assistant initialized.');

const realAdapter = new RealDigiicampusAdapter();

// Installation event
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('[Background Service Worker] Extension installed/updated:', details.reason);
  const existingSettings = await storageService.getSettings();
  await storageService.saveSettings(existingSettings);
});

// Message hub between popup, content scripts, and background worker
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { action, payload } = message;

  (async () => {
    try {
      if (action === 'CHECK_SESSION') {
        const session = await realAdapter.detectSession();
        await storageService.saveSessionStatus(session);
        sendResponse({ success: true, session });
      } else if (action === 'GET_SEMESTERS') {
        const semesters = await realAdapter.getSemesters();
        sendResponse({ success: true, semesters });
      } else if (action === 'GET_COURSES') {
        const courses = await realAdapter.getCourses(payload?.semesterId || '');
        sendResponse({ success: true, courses });
      } else {
        sendResponse({ success: false, error: 'Unknown action' });
      }
    } catch (err: any) {
      console.error('[Background Service Worker Error]:', err);
      sendResponse({ success: false, error: err.message });
    }
  })();

  return true; // Keep message channel open for async execution
});
