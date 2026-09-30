import { CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { GenerationProgress } from '../../types';
import { getTranslation } from '../../utils/i18n';

interface ProgressModalProps {
  progress: GenerationProgress;
  onClose: () => void;
}

export function ProgressModal({ progress, onClose }: ProgressModalProps) {
  const t = getTranslation();
  const isComplete = progress.stage === 'complete';
  const isError = progress.stage === 'error';

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <div className="modal-title">
          <span>
            {isError
              ? t.errorTitle
              : isComplete
                ? t.generationComplete
                : 'Generating Study Notes'}
          </span>
          {(isComplete || isError) && (
            <button className="icon-btn" onClick={onClose}>
              <X size={16} />
            </button>
          )}
        </div>

        {!isError && (
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        )}

        <div className="progress-status-text">
          {isComplete ? (
            <CheckCircle2 size={18} style={{ color: 'var(--success-text)' }} />
          ) : isError ? (
            <AlertTriangle size={18} style={{ color: 'var(--error-text)' }} />
          ) : (
            <div className="spinner" />
          )}
          <span>{progress.message}</span>
        </div>

        {isError && (
          <button
            className="generate-btn"
            onClick={onClose}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {t.close}
          </button>
        )}
      </div>
    </div>
  );
}
