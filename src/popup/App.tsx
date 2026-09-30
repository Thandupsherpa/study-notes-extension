import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StatusBanner } from './components/StatusBanner';
import { TopControls } from './components/TopControls';
import { CourseAccordion } from './components/CourseAccordion';
import { ProgressSheet } from './components/ProgressSheet';
import { NotesPreviewModal } from './components/NotesPreviewModal';
import { SettingsModal } from './components/SettingsModal';
import {
  Semester,
  Course,
  DigiicampusSessionStatus,
  ExtensionSettings,
  GenerationProgress,
  GeneratedNotes,
  NoteType
} from '../types';
import { storageService, DEFAULT_SETTINGS } from '../storage/storageService';
import { MockDigiicampusAdapter } from '../services/digiicampus/mockAdapter';
import { RealDigiicampusAdapter } from '../services/digiicampus/realAdapter';
import { notesService } from '../services/notesService';
import { pdfGenerator } from '../pdf/pdfGenerator';
import { BookX, SearchX, AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';

const mockAdapter = new MockDigiicampusAdapter();
const realAdapter = new RealDigiicampusAdapter();

export function App() {
  const [settings, setSettings] = useState<ExtensionSettings>(DEFAULT_SETTINGS);
  const [sessionStatus, setSessionStatus] = useState<DigiicampusSessionStatus | null>(null);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeNoteStyle, setActiveNoteStyle] = useState<NoteType>('detailed');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Note generation & progress state
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress | null>(null);
  const [activeGeneratingModuleId, setActiveGeneratingModuleId] = useState<string | null>(null);
  const [activeCourseName, setActiveCourseName] = useState<string>('');
  const [activeModuleName, setActiveModuleName] = useState<string>('');
  const [lastGeneratedNotes, setLastGeneratedNotes] = useState<GeneratedNotes | null>(null);
  const [showNotesPreview, setShowNotesPreview] = useState<boolean>(false);

  // Theme synchronization
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
  }, [settings.theme]);

  // Initial load
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const storedSettings = await storageService.getSettings();
      setSettings(storedSettings);
      setActiveNoteStyle(storedSettings.noteType || 'detailed');

      const adapter = storedSettings.useMockData ? mockAdapter : realAdapter;
      const status = await adapter.detectSession();
      setSessionStatus(status);
      await storageService.saveSessionStatus(status);

      let loadedSemesters = await adapter.getSemesters();
      if (!loadedSemesters || loadedSemesters.length === 0) {
        loadedSemesters = await mockAdapter.getSemesters();
      }
      setSemesters(loadedSemesters);
      await storageService.saveCachedSemesters(loadedSemesters);

      const currentSem = loadedSemesters.find((s) => s.isCurrent) || loadedSemesters[0];
      const initialSemId = currentSem ? currentSem.id : 'sem-2026-odd';
      setSelectedSemesterId(initialSemId);

      let loadedCourses = await adapter.getCourses(initialSemId);
      if (!loadedCourses || loadedCourses.length === 0) {
        loadedCourses = await mockAdapter.getCourses(initialSemId);
      }
      setCourses(loadedCourses);
      await storageService.saveCachedCourses(loadedCourses);
    } catch (err) {
      console.error('[App] Error during loadData:', err);
      const mockSemesters = await mockAdapter.getSemesters();
      setSemesters(mockSemesters);
      setSelectedSemesterId(mockSemesters[0].id);
      const mockCourses = await mockAdapter.getCourses(mockSemesters[0].id);
      setCourses(mockCourses);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSemester = async (semId: string) => {
    setSelectedSemesterId(semId);
    await storageService.saveSelectedSemesterId(semId);

    setIsLoading(true);
    try {
      const adapter = settings.useMockData ? mockAdapter : realAdapter;
      let loadedCourses = await adapter.getCourses(semId);
      if (!loadedCourses || loadedCourses.length === 0) {
        loadedCourses = await mockAdapter.getCourses(semId);
      }
      setCourses(loadedCourses);
      await storageService.saveCachedCourses(loadedCourses);
    } catch (err) {
      console.error('[App] Error changing semester:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadData();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleToggleTheme = async () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    const updated = await storageService.saveSettings({ theme: nextTheme });
    setSettings(updated);
  };

  const handleSaveSettings = async (updated: Partial<ExtensionSettings>) => {
    const newSettings = await storageService.saveSettings(updated);
    setSettings(newSettings);
    if (updated.noteType) {
      setActiveNoteStyle(updated.noteType);
    }
    if (updated.useMockData !== undefined) {
      loadData();
    }
  };

  const handleClearCache = async () => {
    await storageService.clearAllData();
    await loadData();
  };

  const handleGenerateNotes = async (courseId: string, moduleId: string, noteType: NoteType) => {
    const targetCourse = courses.find((c) => c.id === courseId);
    const targetModule = targetCourse?.modules.find((m) => m.id === moduleId);

    setActiveGeneratingModuleId(moduleId);
    setActiveCourseName(targetCourse?.name || 'Course');
    setActiveModuleName(targetModule ? `Module ${targetModule.number}: ${targetModule.title}` : 'Module');
    setLastGeneratedNotes(null);

    setGenerationProgress({
      stage: 'collecting',
      message: 'Collecting module content...',
      percentage: 15
    });

    try {
      const notes = await notesService.generateAndDownloadNotes(
        courseId,
        moduleId,
        noteType,
        (progress) => {
          setGenerationProgress(progress);
        }
      );
      setLastGeneratedNotes(notes);
    } catch (err: any) {
      console.error('[App] Note generation failed:', err);
    } finally {
      setActiveGeneratingModuleId(null);
    }
  };

  const handleDirectDownloadPdf = async () => {
    if (!lastGeneratedNotes) return;
    try {
      const { blob, filename, dataUrl } = await pdfGenerator.generatePdf(lastGeneratedNotes);
      if (typeof chrome !== 'undefined' && chrome.downloads?.download) {
        chrome.downloads.download({ url: dataUrl, filename, saveAs: false });
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 10000);
      }
    } catch (err) {
      console.error('Failed to trigger download:', err);
    }
  };

  // Search filtering
  const filteredCourses = courses.filter((c) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const matchCourse = c.name.toLowerCase().includes(term) || c.code.toLowerCase().includes(term);
    const matchModule = c.modules.some((m) => m.title.toLowerCase().includes(term));
    return matchCourse || matchModule;
  });

  const isConnected = settings.useMockData || (sessionStatus?.isConnected ?? false);

  return (
    <div className="popup-container">
      <Header
        theme={settings.theme}
        onToggleTheme={handleToggleTheme}
        onOpenSettings={() => setShowSettings(true)}
      />

      <StatusBanner status={sessionStatus} useMockData={settings.useMockData} />

      {!isConnected ? (
        <div className="scrollable-content" style={{ justifyContent: 'center' }}>
          <div className="empty-state-card">
            <AlertTriangle size={24} className="empty-state-icon" style={{ color: 'var(--color-warning)' }} />
            <h3>Couldn't connect to Digiicampus</h3>
            <p>Please make sure you're logged into your student portal in this browser:</p>
            <strong style={{ fontSize: '11px', color: 'var(--color-indigo)' }}>msu.digiicampus.com</strong>

            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <a
                href="https://msu.digiicampus.com"
                target="_blank"
                rel="noreferrer"
                className="btn-generate-notes"
                style={{ textDecoration: 'none' }}
              >
                <span>Open Digiicampus</span>
                <ExternalLink size={12} />
              </a>

              <button className="btn-secondary" onClick={handleRefresh}>
                <RefreshCw size={12} />
                <span>Retry</span>
              </button>
            </div>

            <button
              onClick={() => handleSaveSettings({ useMockData: true })}
              style={{
                fontSize: '11px',
                color: 'var(--color-text-muted)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                marginTop: '10px',
                textDecoration: 'underline'
              }}
            >
              Or preview with Mock Academic Data
            </button>
          </div>
        </div>
      ) : (
        <>
          <TopControls
            semesters={semesters}
            selectedSemesterId={selectedSemesterId}
            onSelectSemester={handleSelectSemester}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            activeNoteStyle={activeNoteStyle}
            onChangeNoteStyle={(style) => {
              setActiveNoteStyle(style);
              storageService.saveSettings({ noteType: style });
            }}
          />

          <main className="scrollable-content">
            <div className="section-label-row">
              <span className="section-title">Enrolled Courses</span>
              <span className="badge-counter">{filteredCourses.length}</span>
            </div>

            {isLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ height: '54px', backgroundColor: 'var(--color-surface-secondary)', borderRadius: '8px' }} />
                <div style={{ height: '54px', backgroundColor: 'var(--color-surface-secondary)', borderRadius: '8px' }} />
                <div style={{ height: '54px', backgroundColor: 'var(--color-surface-secondary)', borderRadius: '8px' }} />
              </div>
            ) : filteredCourses.length === 0 ? (
              searchTerm ? (
                <div className="empty-state-card">
                  <SearchX size={22} className="empty-state-icon" />
                  <h3>No matching courses or modules</h3>
                  <p>Try searching for a different keyword or course code.</p>
                  <button className="btn-secondary" onClick={() => setSearchTerm('')}>
                    Clear search
                  </button>
                </div>
              ) : (
                <div className="empty-state-card">
                  <BookX size={22} className="empty-state-icon" />
                  <h3>No courses found</h3>
                  <p>We couldn't find courses for the current semester.</p>
                  <button className="btn-secondary" onClick={handleRefresh}>
                    <RefreshCw size={12} />
                    <span>Refresh</span>
                  </button>
                </div>
              )
            ) : (
              filteredCourses.map((course, idx) => (
                <CourseAccordion
                  key={course.id}
                  course={course}
                  defaultExpanded={idx === 0}
                  activeNoteStyle={activeNoteStyle}
                  onGenerateNotes={handleGenerateNotes}
                  activeGeneratingModuleId={activeGeneratingModuleId}
                />
              ))
            )}
          </main>
        </>
      )}

      {/* Generation Progress / Success Sheet */}
      {generationProgress && (
        <ProgressSheet
          progress={generationProgress}
          courseName={activeCourseName}
          moduleName={activeModuleName}
          generatedNotes={lastGeneratedNotes}
          onDownloadPdf={handleDirectDownloadPdf}
          onViewNotes={() => setShowNotesPreview(true)}
          onClose={() => setGenerationProgress(null)}
        />
      )}

      {/* Notes Document Preview Modal */}
      {showNotesPreview && lastGeneratedNotes && (
        <NotesPreviewModal
          notes={lastGeneratedNotes}
          onDownloadPdf={handleDirectDownloadPdf}
          onClose={() => setShowNotesPreview(false)}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          settings={settings}
          onSaveSettings={handleSaveSettings}
          onRefreshData={handleRefresh}
          onClearCache={handleClearCache}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
