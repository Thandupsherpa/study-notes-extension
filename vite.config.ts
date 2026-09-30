import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';

// Custom plugin to copy manifest.json & icons to dist/ after build
function copyExtensionAssets() {
  return {
    name: 'copy-extension-assets',
    closeBundle() {
      const distDir = resolve(__dirname, 'dist');
      if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
      }

      // Read manifest.json and adjust paths for dist output
      const manifestPath = resolve(__dirname, 'manifest.json');
      if (fs.existsSync(manifestPath)) {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
        // In dist, compiled JS files are under assets/ background/ content/
        manifest.background.service_worker = 'src/background/serviceWorker.js';
        manifest.content_scripts[0].js = ['src/content/digiiContentScript.js'];

        fs.writeFileSync(resolve(distDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
        console.log('[Vite Build] Copied manifest.json to dist/');
      }

      // Copy public/icons directory
      const iconsSrc = resolve(__dirname, 'public/icons');
      const iconsDist = resolve(distDir, 'icons');
      if (fs.existsSync(iconsSrc)) {
        if (!fs.existsSync(iconsDist)) {
          fs.mkdirSync(iconsDist, { recursive: true });
        }
        fs.readdirSync(iconsSrc).forEach((file) => {
          fs.copyFileSync(resolve(iconsSrc, file), resolve(iconsDist, file));
        });
        console.log('[Vite Build] Copied icons to dist/icons/');
      }
    }
  };
}

export default defineConfig({
  plugins: [react(), copyExtensionAssets()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        popup: resolve(__dirname, 'popup.html'),
        serviceWorker: resolve(__dirname, 'src/background/serviceWorker.ts'),
        digiiContentScript: resolve(__dirname, 'src/content/digiiContentScript.ts')
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'serviceWorker') {
            return 'src/background/serviceWorker.js';
          }
          if (chunkInfo.name === 'digiiContentScript') {
            return 'src/content/digiiContentScript.js';
          }
          return 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  }
});
