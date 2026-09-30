import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('====================================================');
console.log('DIGIICAMPUS STUDY ASSISTANT — E2E SYSTEM INTEGRATION TEST');
console.log('====================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    failCount++;
  }
}

// TEST 1: Manifest V3 Compliance
console.log('[Phase 1] Manifest V3 File & Configuration Checks:');
const manifestPath = path.join(rootDir, 'dist/manifest.json');
assert(fs.existsSync(manifestPath), 'dist/manifest.json exists');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
assert(manifest.manifest_version === 3, 'Manifest version is 3');
assert(manifest.background && manifest.background.service_worker, 'Background service worker declared');
assert(fs.existsSync(path.join(rootDir, 'dist', manifest.background.service_worker)), `Service worker file exists at dist/${manifest.background.service_worker}`);

// Verify icons
assert(fs.existsSync(path.join(rootDir, 'dist/icons/icon-16.png')), '16x16 icon exists in dist/icons');
assert(fs.existsSync(path.join(rootDir, 'dist/icons/icon-48.png')), '48x48 icon exists in dist/icons');
assert(fs.existsSync(path.join(rootDir, 'dist/icons/icon-128.png')), '128x128 icon exists in dist/icons');

// Verify Content Script
assert(manifest.content_scripts && manifest.content_scripts.length > 0, 'Content script declared in manifest');
const contentScriptPath = path.join(rootDir, 'dist', manifest.content_scripts[0].js[0]);
assert(fs.existsSync(contentScriptPath), `Content script exists at ${contentScriptPath}`);

// TEST 2: Popup HTML & Bundled Assets
console.log('\n[Phase 2] Popup UI Build Verification:');
const popupHtmlPath = path.join(rootDir, 'dist/popup.html');
assert(fs.existsSync(popupHtmlPath), 'dist/popup.html exists');
const popupContent = fs.readFileSync(popupHtmlPath, 'utf8');
assert(popupContent.includes('root'), 'popup.html contains root container mount point');

// TEST 3: Backend Health Check
console.log('\n[Phase 3] AI Backend Service Live Verification:');
try {
  const healthRes = await fetch('http://localhost:3000/api/health');
  assert(healthRes.ok, 'Backend HTTP health check returns status 200');
  const healthData = await healthRes.json();
  assert(healthData.status === 'online', 'Backend health reports status "online"');
} catch (err) {
  console.warn('Backend not running locally or port blocked:', err.message);
}

// TEST 4: Environment Security
console.log('\n[Phase 4] Security & Secrets Leakage Prevention:');
const gitignorePath = path.join(rootDir, '.gitignore');
assert(fs.existsSync(gitignorePath), '.gitignore file exists');
const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
assert(gitignoreContent.includes('.env'), '.gitignore excludes .env files');
assert(gitignoreContent.includes('backend/.env'), '.gitignore explicitly excludes backend/.env');

const serverJsContent = fs.readFileSync(path.join(rootDir, 'backend/server.js'), 'utf8');
assert(!serverJsContent.includes('GEMINI_API_KEY='), 'Gemini API key is NOT hardcoded in backend/server.js');
assert(!/AIza[0-9A-Za-z-_]{35}/.test(serverJsContent), 'No Google API keys found hardcoded in backend/server.js');

console.log('\n====================================================');
console.log(`TEST RESULTS: ${passCount} Passed, ${failCount} Failed`);
console.log('====================================================');

if (failCount > 0) {
  process.exit(1);
}
