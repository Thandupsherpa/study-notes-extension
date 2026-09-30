# Digiicampus Study Assistant (Chrome Extension Manifest V3)

A production-quality Chrome Extension using Manifest V3, React 18, TypeScript, and Vite that works as an AI-powered student study assistant for Digiicampus.

---

## 🌟 Key Features

1. **Seamless Session Integration**: Works directly with the student's existing authenticated Digiicampus session. Never asks for or stores passwords.
2. **Automatic Course & Semester Detection**: Identifies current and past terms, listing enrolled courses in a clean dropdown/accordion interface.
3. **Module & Resource Mapping**: Displays all modules, topics, and accessible study materials for every course.
4. **AI-Powered Academic Note Generation**: Transforms raw module text into structured study notes featuring:
   - Module overview & Learning objectives
   - Core concepts callouts
   - Step-by-step detailed explanations
   - Key definitions table
   - Practical worked examples & solved problems
   - Mathematical formulas & equations
   - Comparison tables & common misconceptions
   - Quick revision points & exam questions with suggested answer outlines
5. **Simple vs Detailed Note Modes**:
   - `Simple Notes`: Concise, revision-focused, key definitions & main points.
   - `Detailed Notes`: Comprehensive, formulas, deep concepts, step-by-step proofs, and exam preparation.
6. **Automatic PDF Generation & Download**: Formats notes into a clean academic PDF document with header/footer page numbering (`Page X of Y`) and triggers an automatic browser download.
7. **Offline Dev / Mock Mode**: Includes a full mock data adapter for offline UI testing and development preview without needing a live Digiicampus login.

---

## 🏗️ Architecture & Data Flow

```
Student 
  ↓
Digiicampus Portal (Authenticated Session)
  ↓
Chrome Extension (Manifest V3)
  ├── Content Script (DOM & Syllabus Parser)
  ├── Popup UI (React + TypeScript + Vite)
  ├── Background Service Worker (MV3 Event Hub)
  └── Chrome Storage (chrome.storage.local)
  ↓
Secure Express Backend API (or Local Proxy)
  ↓
Google Gemini AI API (@google/genai)
  ↓
Structured Study Notes (JSON Schema)
  ↓
Academic PDF Generator (jsPDF + AutoTable)
  ↓
Automatic Browser Download (chrome.downloads)
```

---

## 📁 Repository Structure

```
study-notes-extension/
├── manifest.json            # Manifest V3 configuration
├── popup.html               # Extension Popup HTML entrypoint
├── package.json             # Root extension dependencies
├── vite.config.ts           # Vite build script for MV3
├── tsconfig.json            # TypeScript configuration
├── CHROMEWEBSTORE.md        # Chrome Web Store metadata & privacy disclosures
├── README.md                # Project documentation
│
├── src/
│   ├── popup/               # React Popup Application
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── StatusBanner.tsx
│   │   │   ├── SemesterSelector.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── CourseAccordion.tsx
│   │   │   ├── ModuleRow.tsx
│   │   │   ├── GenerateButton.tsx
│   │   │   ├── ProgressModal.tsx
│   │   │   └── SettingsModal.tsx
│   │   └── styles/
│   │       └── index.css    # Academic UI CSS design system
│   │
│   ├── content/             # Injected Content Script
│   │   ├── digiiContentScript.ts
│   │   └── parsers/
│   │       └── domParser.ts
│   │
│   ├── background/          # Background Service Worker
│   │   └── serviceWorker.ts
│   │
│   ├── services/
│   │   ├── api.ts           # AI Note Generation API client
│   │   ├── notesService.ts  # Workflow orchestrator
│   │   └── digiicampus/
│   │       ├── adapter.ts   # DigiicampusAdapter interface
│   │       ├── realAdapter.ts
│   │       └── mockAdapter.ts
│   │
│   ├── pdf/
│   │   └── pdfGenerator.ts  # jsPDF academic document generator
│   │
│   ├── storage/
│   │   └── storageService.ts# chrome.storage wrapper
│   ├── types/
│   │   └── index.ts         # TypeScript interface definitions
│   └── utils/
│       └── i18n.ts          # UI Localization dictionary
│
├── public/
│   └── icons/               # Extension icons (16x16, 48x48, 128x128 PNG)
│
├── backend/                 # Secure AI Backend Server
│   ├── package.json
│   ├── server.js            # Express server with @google/genai SDK
│   └── .env.example
│
└── scripts/
    └── generate-icons.js    # Node PNG icon generator
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- Google Chrome Browser

### 2. Install Dependencies
```bash
# Install root extension dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..
```

---

## ⚙️ Running the AI Backend Server

The AI note generation service runs on a secure Node.js/Express server so that API keys are never exposed inside the client Chrome extension.

1. Open `backend/.env` (or copy from `backend/.env.example`):
   ```env
   PORT=3000
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
2. Start the server:
   ```bash
   cd backend
   npm start
   ```
3. Verify backend health check:
   ```bash
   curl http://localhost:3000/api/health
   # Returns: {"status":"online","service":"Digiicampus Study Notes Backend", ...}
   ```

---

## 📦 Building the Chrome Extension

To compile the React components, content script, and service worker into `dist/`:

```bash
npm run build
```

This generates the uncompressed unpacked extension inside the `dist/` directory:
- `dist/manifest.json`
- `dist/popup.html`
- `dist/src/background/serviceWorker.js`
- `dist/src/content/digiiContentScript.js`
- `dist/icons/`

---

## 🧩 Loading the Extension into Google Chrome

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** using the toggle in the top-right corner.
3. Click **Load unpacked**.
4. Select the `dist/` folder inside this repository (`/home/thandup/study-notes-extension/dist`).
5. Click the extension icon in your Chrome toolbar to open the **Digiicampus Study Assistant**.

---

## 🔒 Security & Privacy

- **No Passwords**: Never asks for or records student login credentials.
- **Session Protection**: Uses existing authenticated browser context without capturing cookies.
- **Backend Key Protection**: Keeps the Gemini API key in `backend/server.js` or environment variables, avoiding client script leakage.
- **Narrow Host Permissions**: Scoped strictly to `https://*.digiicampus.com/*`.

---

## 📜 License

MIT License. See LICENSE file for details.
