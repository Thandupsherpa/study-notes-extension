import { X, Download, BookOpen } from 'lucide-react';
import { GeneratedNotes } from '../../types';

interface NotesPreviewModalProps {
  notes: GeneratedNotes;
  onDownloadPdf: () => void;
  onClose: () => void;
}

export function NotesPreviewModal({
  notes,
  onDownloadPdf,
  onClose
}: NotesPreviewModalProps) {
  return (
    <div className="modal-overlay">
      <div className="modal-content-card" style={{ maxHeight: '580px' }}>
        <div className="modal-header-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={16} style={{ color: 'var(--color-indigo)' }} />
            <div>
              <h2 style={{ fontSize: '13px' }}>{notes.courseName}</h2>
              <p style={{ fontSize: '10.5px', color: 'var(--color-text-muted)' }}>{notes.moduleTitle}</p>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close document">
            <X size={15} />
          </button>
        </div>

        <div className="notes-preview-body" style={{ overflowY: 'auto', flex: 1 }}>
          <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '10px', marginBottom: '14px' }}>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-indigo)', fontWeight: 700 }}>
              Academic Study Notes • {notes.noteType.toUpperCase()}
            </span>
            <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>
              Generated on {notes.generatedAt}
            </p>
          </div>

          <h3>1. Module Overview</h3>
          <p>{notes.overview}</p>

          {notes.learningObjectives && notes.learningObjectives.length > 0 && (
            <>
              <h3>2. Learning Objectives</h3>
              <ul style={{ paddingLeft: '18px', marginBottom: '12px' }}>
                {notes.learningObjectives.map((obj, i) => (
                  <li key={i} style={{ marginBottom: '4px' }}>{obj}</li>
                ))}
              </ul>
            </>
          )}

          {notes.keyConcepts && notes.keyConcepts.length > 0 && (
            <>
              <h3>3. Core Concepts</h3>
              <div style={{ backgroundColor: 'var(--color-surface-secondary)', padding: '10px', borderRadius: '6px', marginBottom: '14px' }}>
                {notes.keyConcepts.map((c, i) => (
                  <div key={i} style={{ fontSize: '11.5px', color: 'var(--color-deep-navy)', marginBottom: '3px' }}>
                    ▸ <strong>{c}</strong>
                  </div>
                ))}
              </div>
            </>
          )}

          {notes.importantDefinitions && notes.importantDefinitions.length > 0 && (
            <>
              <h3>4. Important Definitions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                {notes.importantDefinitions.map((d, i) => (
                  <div key={i} style={{ fontSize: '11.5px' }}>
                    <strong style={{ color: 'var(--color-indigo)' }}>{d.term}:</strong> {d.definition}
                  </div>
                ))}
              </div>
            </>
          )}

          {notes.quickRevisionPoints && notes.quickRevisionPoints.length > 0 && (
            <>
              <h3>5. Quick Revision Points</h3>
              <ul style={{ paddingLeft: '18px', marginBottom: '12px' }}>
                {notes.quickRevisionPoints.map((pt, i) => (
                  <li key={i} style={{ marginBottom: '4px' }}>{pt}</li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div style={{ padding: '10px 14px', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
          <button className="btn-generate-notes" onClick={onDownloadPdf}>
            <Download size={13} />
            <span>Download PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
