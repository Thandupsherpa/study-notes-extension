import { Module, NoteType } from '../../types';
import { GenerateButton } from './GenerateButton';

interface ModuleRowProps {
  module: Module;
  activeNoteStyle: NoteType;
  onGenerateNotes: (moduleId: string, noteType: NoteType) => void;
  isGenerating?: boolean;
}

export function ModuleRow({
  module,
  activeNoteStyle,
  onGenerateNotes,
  isGenerating = false
}: ModuleRowProps) {
  // Format module number with leading zero e.g. "Module 01"
  const formattedNumber = `Module ${String(module.number).padStart(2, '0')}`;

  return (
    <div className="module-card">
      <div className="module-top-row">
        <div>
          <span className="module-num-badge">{formattedNumber}</span>
          <h4 className="module-heading-text">{module.title}</h4>
        </div>
        {module.resourceCount > 0 && (
          <span className="module-resources-count">
            {module.resourceCount} {module.resourceCount === 1 ? 'resource' : 'resources'}
          </span>
        )}
      </div>

      <div className="module-actions-row">
        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
          Mode: <strong style={{ color: 'var(--color-indigo)' }}>{activeNoteStyle === 'detailed' ? 'Detailed' : 'Simple'}</strong>
        </span>

        <GenerateButton
          onGenerate={() => onGenerateNotes(module.id, activeNoteStyle)}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  );
}
