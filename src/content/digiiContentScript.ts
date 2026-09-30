import { DigiicampusDomParser } from './parsers/domParser';

console.log('[Digiicampus Study Assistant] Content script injected and active.');

// Listen for messages from popup or background service worker
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { action, payload } = message;

  switch (action) {
    case 'DETECT_SESSION': {
      const status = DigiicampusDomParser.detectSession();
      sendResponse({ success: true, status });
      break;
    }

    case 'GET_SEMESTERS': {
      const semesters = DigiicampusDomParser.extractSemesters();
      sendResponse({ success: true, semesters });
      break;
    }

    case 'GET_COURSES': {
      const semesterId = payload?.semesterId || 'sem-active';
      const courses = DigiicampusDomParser.extractCourses(semesterId);
      sendResponse({ success: true, courses });
      break;
    }

    case 'GET_MODULE_CONTENT': {
      const { courseName, moduleTitle } = payload || {};
      const extracted = DigiicampusDomParser.extractModuleContent(courseName || '', moduleTitle || '');
      sendResponse({ success: true, content: extracted });
      break;
    }

    default:
      sendResponse({ success: false, error: `Unknown action: ${action}` });
      break;
  }

  return true; // Keeps async response channel open
});
