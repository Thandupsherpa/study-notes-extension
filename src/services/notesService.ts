import { DigiicampusAdapter } from './digiicampus/adapter';
import { MockDigiicampusAdapter } from './digiicampus/mockAdapter';
import { RealDigiicampusAdapter } from './digiicampus/realAdapter';
import { apiService } from './api';
import { pdfGenerator } from '../pdf/pdfGenerator';
import { storageService } from '../storage/storageService';
import { NoteType, GenerationProgress, GeneratedNotes } from '../types';

export class NotesService {
  private mockAdapter = new MockDigiicampusAdapter();
  private realAdapter = new RealDigiicampusAdapter();

  private async getAdapter(): Promise<DigiicampusAdapter> {
    const settings = await storageService.getSettings();
    if (settings.useMockData) {
      return this.mockAdapter;
    }
    // Try real adapter first, if fails or disconnected fallback to mock
    const session = await this.realAdapter.detectSession();
    if (session.isConnected) {
      return this.realAdapter;
    }
    return this.mockAdapter;
  }

  /**
   * Orchestrate note generation & PDF download workflow
   */
  async generateAndDownloadNotes(
    courseId: string,
    moduleId: string,
    noteType: NoteType = 'detailed',
    onProgress: (progress: GenerationProgress) => void
  ): Promise<GeneratedNotes> {
    try {
      // Step 1: Collecting module content
      onProgress({
        stage: 'collecting',
        message: 'Collecting accessible module content...',
        percentage: 15
      });

      const adapter = await this.getAdapter();
      const content = await adapter.getModuleContent(courseId, moduleId);

      // Step 2: Analyzing material
      onProgress({
        stage: 'analyzing',
        message: 'Analyzing material with AI backend...',
        percentage: 35
      });

      await new Promise(r => setTimeout(r, 400));

      // Step 3: Creating study notes
      onProgress({
        stage: 'generating',
        message: 'Creating structured study notes...',
        percentage: 60
      });

      const notes = await apiService.generateStudyNotes(content, noteType);

      // Step 4: Formatting PDF
      onProgress({
        stage: 'formatting',
        message: 'Formatting academic PDF document...',
        percentage: 85
      });

      const { blob, filename, dataUrl } = await pdfGenerator.generatePdf(notes);

      // Step 5: Downloading PDF
      onProgress({
        stage: 'downloading',
        message: 'Downloading PDF to your computer...',
        percentage: 95
      });

      await this.downloadFile(blob, filename, dataUrl);

      onProgress({
        stage: 'complete',
        message: `Successfully downloaded ${filename}`,
        percentage: 100
      });

      return notes;
    } catch (err: any) {
      console.error('[NotesService Error]:', err);
      onProgress({
        stage: 'error',
        message: err.message || 'Failed to generate notes. Please try again.',
        percentage: 0,
        error: err.message
      });
      throw err;
    }
  }

  private async downloadFile(blob: Blob, filename: string, dataUrl: string): Promise<void> {
    if (typeof chrome !== 'undefined' && chrome.downloads?.download) {
      return new Promise((resolve, reject) => {
        chrome.downloads.download(
          {
            url: dataUrl,
            filename: filename,
            saveAs: false
          },
          (downloadId) => {
            if (chrome.runtime.lastError) {
              console.warn('[NotesService] chrome.downloads failed, using Blob URL fallback:', chrome.runtime.lastError.message);
              this.triggerBrowserDownload(blob, filename);
            }
            resolve();
          }
        );
      });
    } else {
      this.triggerBrowserDownload(blob, filename);
    }
  }

  private triggerBrowserDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }
}

export const notesService = new NotesService();
