import { useState } from 'react';
import { X, RefreshCw, Trash2, Check } from 'lucide-react';
import { ExtensionSettings } from '../../types';

interface SettingsModalProps {
  settings: ExtensionSettings;
  onSaveSettings: (updated: Partial<ExtensionSettings>) => void;
  onRefreshData: () => void;
  onClearCache: () => void;
  onClose: () => void;
}

export function SettingsModal({
  settings,
  onSaveSettings,
  onRefreshData,
  onClearCache,
  onClose
}: SettingsModalProps) {
  const [formData, setFormData] = useState<ExtensionSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content-card">
        <div className="modal-header-bar">
          <h2>Settings</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close settings">
            <X size={15} />
          </button>
        </div>

        <div className="modal-body-scroll">
          {/* Note Style */}
          <div>
            <span className="settings-section-title">Default Note Style</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
              <label className="checkbox-label">
                <input
                  type="radio"
                  name="noteStyle"
                  checked={formData.noteType === 'detailed'}
                  onChange={() => setFormData({ ...formData, noteType: 'detailed' })}
                />
                <span>Detailed (Comprehensive explanations, formulas & exam Qs)</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="radio"
                  name="noteStyle"
                  checked={formData.noteType === 'simple'}
                  onChange={() => setFormData({ ...formData, noteType: 'simple' })}
                />
                <span>Simple (Concise revision summary & key definitions)</span>
              </label>
            </div>
          </div>

          {/* Inclusions */}
          <div>
            <span className="settings-section-title">Include in Notes</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  className="checkbox-input"
                  checked={formData.includeExamples}
                  onChange={(e) => setFormData({ ...formData, includeExamples: e.target.checked })}
                />
                <span>Examples & Solved Calculations</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  className="checkbox-input"
                  checked={formData.includeExamQuestions}
                  onChange={(e) => setFormData({ ...formData, includeExamQuestions: e.target.checked })}
                />
                <span>Important Exam Questions & Tips</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  className="checkbox-input"
                  checked={formData.autoDownload}
                  onChange={(e) => setFormData({ ...formData, autoDownload: e.target.checked })}
                />
                <span>Automatic PDF Download</span>
              </label>
            </div>
          </div>

          {/* Appearance */}
          <div>
            <span className="settings-section-title">Appearance</span>
            <div style={{ display: 'flex', gap: '14px', marginTop: '6px' }}>
              {(['light', 'dark', 'system'] as const).map((t) => (
                <label key={t} className="checkbox-label">
                  <input
                    type="radio"
                    name="theme"
                    checked={formData.theme === t}
                    onChange={() => setFormData({ ...formData, theme: t })}
                  />
                  <span style={{ textTransform: 'capitalize' }}>{t}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Developer / Mock Mode */}
          <div>
            <span className="settings-section-title">Environment & Connectivity</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  className="checkbox-input"
                  checked={formData.useMockData}
                  onChange={(e) => setFormData({ ...formData, useMockData: e.target.checked })}
                />
                <span>Developer / Mock Mode (Offline Testing)</span>
              </label>
              <p style={{ fontSize: '10.5px', color: 'var(--color-text-muted)', margin: 0, paddingLeft: '24px' }}>
                Simulates real MSU Digiicampus courses for testing when outside portal hours.
              </p>

              <div style={{ marginTop: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '3px' }}>
                  AI Backend URL
                </label>
                <input
                  type="text"
                  className="styled-select"
                  style={{ cursor: 'text', padding: '6px 10px' }}
                  value={formData.backendUrl}
                  onChange={(e) => setFormData({ ...formData, backendUrl: e.target.value })}
                  placeholder="http://localhost:3000"
                />
              </div>
            </div>
          </div>

          {/* Data Actions */}
          <div style={{ paddingTop: '4px' }}>
            <span className="settings-section-title">Data Management</span>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <button
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center', fontSize: '11px' }}
                onClick={onRefreshData}
              >
                <RefreshCw size={12} />
                <span>Refresh Data</span>
              </button>

              <button
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center', fontSize: '11px', color: 'var(--color-error)' }}
                onClick={onClearCache}
              >
                <Trash2 size={12} />
                <span>Clear Cache</span>
              </button>
            </div>
          </div>
        </div>

        <div style={{ padding: '10px 14px', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-generate-notes" onClick={handleSave}>
            {savedSuccess ? <Check size={13} /> : null}
            <span>{savedSuccess ? 'Saved' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
