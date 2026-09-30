import { Check, Download, Eye, AlertCircle, X } from 'lucide-react';
import { GenerationProgress, GeneratedNotes } from '../../types';

interface ProgressSheetProps {
  progress: GenerationProgress;
  courseName?: string;
  moduleName?: string;
  generatedNotes?: GeneratedNotes | null;
  onDownloadPdf?: () => void;
  onViewNotes?: () => void;
  onClose: () => void;
}

export function ProgressSheet({
  progress,
  courseName,
  moduleName,
  generatedNotes,
  onDownloadPdf,
  onViewNotes,
  onClose
}: ProgressSheetProps) {
  const isComplete = progress.stage === 'complete';
  const isError = progress.stage === 'error';

  // Progress steps mapping
  const steps = [
    { id: 'collecting', label: 'Collecting module content' },
    { id: 'analyzing', label: 'Analyzing learning material' },
    { id: 'generating', label: 'Writing structured notes' },
    { id: 'formatting', label: 'Creating academic PDF' }
  ];

  const getStepStatus = (stepId: string) => {
    if (isComplete) return 'completed';
    const stageOrder = ['collecting', 'analyzing', 'generating', 'formatting', 'downloading', 'complete'];
    const currentIndex = stageOrder.indexOf(progress.stage);
    const stepIndex = stageOrder.indexOf(stepId);

    if (currentIndex > stepIndex) return 'completed';
    if (currentIndex === stepIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="progress-card-overlay">
      <div className="progress-header-row">
        <div>
          <h3>{isComplete ? 'Notes Ready' : isError ? 'Generation Failed' : 'Generating your notes'}</h3>
          {(moduleName || courseName) && (
            <p className="progress-module-title">
              {moduleName} {courseName ? `• ${courseName}` : ''}
            </p>
          )}
        </div>
        {(isComplete || isError) && (
          <button className="icon-btn" onClick={onClose} aria-label="Close panel">
            <X size={15} />
          </button>
        )}
      </div>

      {!isComplete && !isError && (
        <>
          <div className="progress-step-list">
            {steps.map((s) => {
              const status = getStepStatus(s.id);
              return (
                <div key={s.id} className={`step-item ${status}`}>
                  <div className="step-icon">
                    {status === 'completed' ? (
                      <Check size={13} style={{ color: 'var(--color-success)' }} />
                    ) : (
                      <div className="step-bullet" />
                    )}
                  </div>
                  <span>{s.label}</span>
                </div>
              );
            })}
          </div>

          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress.percentage}%` }} />
          </div>

          <div className="progress-pct-row">
            <span>{progress.message}</span>
            <span>{progress.percentage}%</span>
          </div>
        </>
      )}

      {isComplete && (
        <>
          <div className="success-banner">
            <Check size={18} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
            <div>
              <h4>Your study notes are ready</h4>
              <p>Generated with university study structure and verified concepts.</p>
            </div>
          </div>

          <div className="success-actions-row">
            {onDownloadPdf && (
              <button
                className="btn-generate-notes"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={onDownloadPdf}
              >
                <Download size={13} />
                <span>Download PDF</span>
              </button>
            )}

            {generatedNotes && onViewNotes && (
              <button
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={onViewNotes}
              >
                <Eye size={13} />
                <span>View Notes</span>
              </button>
            )}
          </div>
        </>
      )}

      {isError && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--color-error)' }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '11.5px', lineHeight: 1.4 }}>
              {progress.error || 'Failed to complete study note generation. Please try again.'}
            </p>
          </div>

          <button
            className="btn-secondary"
            onClick={onClose}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
