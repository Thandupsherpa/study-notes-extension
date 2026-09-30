import { SemesterSelector } from './SemesterSelector';
import { SearchBar } from './SearchBar';
import { Semester, NoteType } from '../../types';

interface TopControlsProps {
  semesters: Semester[];
  selectedSemesterId: string;
  onSelectSemester: (semesterId: string) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  activeNoteStyle: NoteType;
  onChangeNoteStyle: (style: NoteType) => void;
}

export function TopControls({
  semesters,
  selectedSemesterId,
  onSelectSemester,
  onRefresh,
  isRefreshing,
  searchTerm,
  onSearchChange,
  activeNoteStyle,
  onChangeNoteStyle
}: TopControlsProps) {
  return (
    <div className="top-controls">
      <SemesterSelector
        semesters={semesters}
        selectedSemesterId={selectedSemesterId}
        onSelectSemester={onSelectSemester}
        onRefresh={onRefresh}
        isRefreshing={isRefreshing}
      />

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
      />

      <div className="note-style-segment">
        <span className="control-label" style={{ marginBottom: 0 }}>Note Style</span>
        <div className="segmented-group">
          <button
            className={`segment-btn ${activeNoteStyle === 'detailed' ? 'active' : ''}`}
            onClick={() => onChangeNoteStyle('detailed')}
          >
            Detailed
          </button>
          <button
            className={`segment-btn ${activeNoteStyle === 'simple' ? 'active' : ''}`}
            onClick={() => onChangeNoteStyle('simple')}
          >
            Simple
          </button>
        </div>
      </div>
    </div>
  );
}
