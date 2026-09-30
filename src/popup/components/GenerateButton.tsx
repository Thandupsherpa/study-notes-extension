import { Sparkles, Loader2 } from 'lucide-react';

interface GenerateButtonProps {
  onGenerate: () => void;
  isGenerating?: boolean;
  disabled?: boolean;
}

export function GenerateButton({
  onGenerate,
  isGenerating = false,
  disabled = false
}: GenerateButtonProps) {
  return (
    <button
      className="btn-generate-notes"
      onClick={onGenerate}
      disabled={isGenerating || disabled}
      aria-label="Generate Study Notes"
    >
      {isGenerating ? (
        <>
          <Loader2 size={13} className="spinner-icon" />
          <span>Generating...</span>
        </>
      ) : (
        <>
          <Sparkles size={12} />
          <span>Generate Notes</span>
        </>
      )}
    </button>
  );
}
