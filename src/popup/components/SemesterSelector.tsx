import { ChevronDown, RefreshCw } from 'lucide-react';
import { Semester } from '../../types';

interface SemesterSelectorProps {
  semesters: Semester[];
  selectedSemesterId: string;
  onSelectSemester: (semesterId: string) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function SemesterSelector({
  semesters,
  selectedSemesterId,
  onSelectSemester,
  onRefresh,
  isRefreshing = false
}: SemesterSelectorProps) {
  return (
    <div>
      <span className="control-label">Current Semester</span>
      <div className="control-row">
        <div className="semester-selector-wrapper">
          <select
            className="styled-select"
            value={selectedSemesterId}
            onChange={(e) => onSelectSemester(e.target.value)}
          >
            {semesters.map((sem) => (
              <option key={sem.id} value={sem.id}>
                {sem.name} {sem.isCurrent ? '• Active' : ''}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="select-chevron" />
        </div>

        <button
          className="refresh-semester-btn"
          onClick={onRefresh}
          title="Refresh Digiicampus data"
          disabled={isRefreshing}
          aria-label="Refresh Digiicampus data"
        >
          <RefreshCw size={13} className={isRefreshing ? 'spinner-icon' : ''} />
        </button>
      </div>
    </div>
  );
}
