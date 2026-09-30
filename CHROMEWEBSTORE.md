# Chrome Web Store Metadata & Publishing Reference

## Listing Details

* **Extension Name:** Digiicampus Study Assistant
* **Short Description:** AI-powered student study assistant & PDF note generator for Digiicampus.
* **Detailed Description:**
  Digiicampus Study Assistant is an academic productivity tool designed for students using Digiicampus LMS. 
  It automatically detects your enrolled courses and active semester, organizes course modules into an intuitive accordion interface, and generates high-yield study notes with a single click.

  Key Features:
  - Seamless Authentication: Automatically uses your active Digiicampus session. No extra password required.
  - Course & Semester Detection: Organizes your enrolled courses by term.
  - One-Click AI Study Notes: Produces structured academic notes including learning objectives, core definitions, step-by-step problem solutions, formula tables, and exam-oriented revision points.
  - Instant Academic PDF Download: Automatically formats notes into a clean, printable academic PDF document.
  - Simple vs Detailed Modes: Choose concise revision notes or deep conceptual breakdowns.

* **Category:** Productivity / Education
* **Language:** English

---

## Permissions & Justifications

| Permission | Scope / Purpose | Justification |
|------------|-----------------|---------------|
| `storage` | `chrome.storage.local` | Used to cache non-sensitive user UI preferences, selected semester ID, and dark/light theme options locally on the device. |
| `activeTab` | Active Browser Tab | Allows the extension to interact with the active Digiicampus tab to read student course module listings. |
| `scripting` | Content Script Injection | Used to execute content parsing scripts on Digiicampus portal pages to read accessible course syllabus items. |
| `downloads` | Browser Downloads API | Triggers automatic download of the generated academic PDF study notes to the user's computer. |
| `tabs` | Browser Tabs API | Used to detect if an active Digiicampus tab is currently open and active in the user's browser. |

### Host Permissions Justification

| Host Pattern | Justification |
|--------------|---------------|
| `https://*.digiicampus.com/*` | Required to read authorized course and module content directly from the student's logged-in Digiicampus portal. |
| `http://*.digiicampus.com/*` | Fallback pattern for HTTP portal environments. |

---

## Privacy & Data Use Disclosure

* **Data Collection:** Does NOT collect, store, or sell personal student credentials or passwords.
* **Data Transmission:** Transmits course module topic titles and accessible lesson text to the specified AI note generation service over HTTPS for processing. Generated data is stateless and not stored permanently on third-party servers.
* **Local Storage:** Uses `chrome.storage.local` strictly on the user's machine for extension configuration and temporary data caching.

---

## Version History

* **v1.0.0 (2026-09-28):** Initial release of Digiicampus Study Assistant featuring MV3 support, React UI, Gemini AI integration, and PDF export engine.
