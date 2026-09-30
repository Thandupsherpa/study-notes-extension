import { useState, useRef } from 'react';
import { ChevronDown, BookOpen } from 'lucide-react';
import { Course, NoteType, Module } from '../../types';
import { ModuleRow } from './ModuleRow';

interface CourseAccordionProps {
  course: Course;
  defaultExpanded?: boolean;
  activeNoteStyle: NoteType;
  onGenerateNotes: (courseId: string, moduleId: string, noteType: NoteType) => void;
  activeGeneratingModuleId?: string | null;
}

export function CourseAccordion({
  course,
  defaultExpanded = false,
  activeNoteStyle,
  onGenerateNotes,
  activeGeneratingModuleId
}: CourseAccordionProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    const next = !isExpanded;
    setIsExpanded(next);
    if (next) {
      setTimeout(() => {
        cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 60);
    }
  };

  return (
    <div ref={cardRef} className={`course-card ${isExpanded ? 'expanded' : ''}`}>
      <div
        className="course-header"
        onClick={handleToggle}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        }}
      >
        <div className="course-title-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BookOpen size={13} style={{ color: 'var(--color-indigo)' }} />
            <span className="course-code-tag">{course.code}</span>
          </div>
          <span className="course-main-name" title={course.name}>
            {course.name}
          </span>
          {course.instructor && (
            <span className="course-instructor-text">
              {course.instructor}
            </span>
          )}
        </div>

        <div className="course-right-meta">
          <span className="module-count-pill">
            {course.modules.length} {course.modules.length === 1 ? 'module' : 'modules'}
          </span>
          <ChevronDown
            size={16}
            className={`chevron-icon ${isExpanded ? 'rotated' : ''}`}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="course-modules-drawer">
          {course.modules.length === 0 ? (
            <div style={{ padding: '12px', fontSize: '11.5px', color: 'var(--color-text-muted)', textAlign: 'center' }}>
              No modules available for this course.
            </div>
          ) : (
            course.modules.map((module: Module) => (
              <ModuleRow
                key={module.id}
                module={module}
                activeNoteStyle={activeNoteStyle}
                isGenerating={activeGeneratingModuleId === module.id}
                onGenerateNotes={(moduleId: string, noteType: NoteType) =>
                  onGenerateNotes(course.id, moduleId, noteType)
                }
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
