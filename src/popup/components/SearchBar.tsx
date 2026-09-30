import { Search, X } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function SearchBar({ searchTerm, onSearchChange }: SearchBarProps) {
  return (
    <div className="search-wrapper">
      <Search size={14} className="search-field-icon" />
      <input
        type="text"
        className="search-input-field"
        placeholder="Search courses or modules..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      {searchTerm && (
        <button
          className="search-clear-btn"
          onClick={() => onSearchChange('')}
          title="Clear search"
          aria-label="Clear search"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}
