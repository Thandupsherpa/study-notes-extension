import { Semester, Course, Module, Resource, DigiicampusSessionStatus } from '../../types';

export class DigiicampusDomParser {

  /**
   * Detect authenticated student session on the current Digiicampus page
   */
  static detectSession(): DigiicampusSessionStatus {
    const isDigiiDomain = window.location.hostname.includes('digiicampus') || 
                          document.title.toLowerCase().includes('digiicampus') ||
                          document.body.innerText.toLowerCase().includes('digiicampus');

    if (!isDigiiDomain) {
      return {
        isConnected: false,
        lastChecked: Date.now(),
        errorMessage: "Not currently on a Digiicampus portal page."
      };
    }

    // Try finding student profile element
    const studentNameEl = document.querySelector(
      '.user-name, .student-name, .profile-name, .user-profile-name, [data-user-name], .header-user-info span, #studentName'
    );
    const studentIdEl = document.querySelector(
      '.student-id, .roll-no, [data-student-id], .user-id, #studentId'
    );

    const isLoggedOut = !!document.querySelector('form[action*="login"], input[name="username"], button.login-btn, #loginForm');

    if (isLoggedOut && !studentNameEl) {
      return {
        isConnected: false,
        lastChecked: Date.now(),
        errorMessage: "Digiicampus session not active. Please log in."
      };
    }

    const studentName = studentNameEl ? studentNameEl.textContent?.trim() : "Student";
    const studentId = studentIdEl ? studentIdEl.textContent?.trim() : undefined;

    return {
      isConnected: true,
      studentName,
      studentId,
      activePortalUrl: window.location.href,
      lastChecked: Date.now()
    };
  }

  /**
   * Extract semesters from dropdowns, tabs, or heading indicators
   */
  static extractSemesters(): Semester[] {
    const semesters: Semester[] = [];

    // Check dropdown <select> elements for semesters
    const semesterSelects = document.querySelectorAll('select[name*="semester"], select[id*="semester"], select[class*="term"]');
    if (semesterSelects.length > 0) {
      const select = semesterSelects[0] as HTMLSelectElement;
      Array.from(select.options).forEach((opt, idx) => {
        if (opt.value && opt.text) {
          semesters.push({
            id: opt.value,
            name: opt.text.trim(),
            isCurrent: opt.selected || idx === 0,
            year: new Date().getFullYear().toString(),
            term: opt.text.includes('Odd') ? 'Odd' : 'Even'
          });
        }
      });
    }

    // Check tab list or pills
    const semesterTabs = document.querySelectorAll('.semester-tab, [data-semester-id], .term-pill');
    semesterTabs.forEach((tab, idx) => {
      const id = tab.getAttribute('data-semester-id') || `sem-tab-${idx}`;
      const name = tab.textContent?.trim() || `Semester ${idx + 1}`;
      semesters.push({
        id,
        name,
        isCurrent: tab.classList.contains('active') || idx === 0,
        year: new Date().getFullYear().toString(),
        term: 'Current'
      });
    });

    // Fallback: If no semester controls found, infer from title / heading or create default
    if (semesters.length === 0) {
      const pageHeading = document.querySelector('h1, h2, .current-term-label')?.textContent || '';
      const currentYear = new Date().getFullYear();
      semesters.push({
        id: 'sem-active',
        name: pageHeading.includes('Semester') ? pageHeading.trim() : `${currentYear} — Active Semester`,
        isCurrent: true,
        year: currentYear.toString(),
        term: 'Current'
      });
    }

    return semesters;
  }

  /**
   * Extract enrolled courses from page cards, tables, or navigation nodes
   */
  static extractCourses(semesterId: string): Course[] {
    const courses: Course[] = [];

    // Strategy 1: Cards (.course-card, .subject-card, .tile, .course-item)
    const courseCards = document.querySelectorAll('.course-card, .subject-card, .course-box, .subject-item, .card-course');
    courseCards.forEach((card, index) => {
      const titleEl = card.querySelector('.course-name, .subject-name, .card-title, h3, h4, .title');
      const codeEl = card.querySelector('.course-code, .subject-code, .badge-code, .sub-code');
      const instructorEl = card.querySelector('.instructor-name, .faculty-name, .teacher-name');

      if (titleEl && titleEl.textContent) {
        const fullTitle = titleEl.textContent.trim();
        const code = codeEl ? codeEl.textContent!.trim() : `CS-${301 + index}`;
        const courseId = card.getAttribute('data-course-id') || `course-${index + 1}`;

        courses.push({
          id: courseId,
          code: code,
          name: fullTitle,
          instructor: instructorEl ? instructorEl.textContent?.trim() : undefined,
          semesterId: semesterId,
          modules: this.extractModulesFromContainer(card, courseId)
        });
      }
    });

    // Strategy 2: Table rows (tr.course-row, tbody tr)
    if (courses.length === 0) {
      const tableRows = document.querySelectorAll('table.courses-table tbody tr, .course-list-table tr');
      tableRows.forEach((row, index) => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 2) {
          const code = cells[0].textContent?.trim() || `CS-${301 + index}`;
          const name = cells[1].textContent?.trim() || `Course ${index + 1}`;
          const instructor = cells.length >= 3 ? cells[2].textContent?.trim() : undefined;
          const courseId = row.getAttribute('data-course-id') || `course-row-${index + 1}`;

          courses.push({
            id: courseId,
            code,
            name,
            instructor,
            semesterId,
            modules: []
          });
        }
      });
    }

    // Strategy 3: Page Accordions or Syllabus Sections
    if (courses.length === 0) {
      const accordions = document.querySelectorAll('.accordion-header, .subject-header, .course-section-title');
      accordions.forEach((acc, index) => {
        const text = acc.textContent?.trim();
        if (text && text.length > 3) {
          courses.push({
            id: `course-acc-${index + 1}`,
            code: `SUB-${101 + index}`,
            name: text,
            semesterId,
            modules: []
          });
        }
      });
    }

    return courses;
  }

  /**
   * Extract modules and topics from a given course container or active page
   */
  static extractModulesFromContainer(container: Element | Document, courseId: string): Module[] {
    const modules: Module[] = [];

    // Search for module elements inside container or page
    const moduleElements = container.querySelectorAll(
      '.module-item, .topic-item, .chapter-card, .unit-box, .accordion-collapse, .syllabus-unit'
    );

    moduleElements.forEach((modEl, idx) => {
      const titleEl = modEl.querySelector('.module-title, .chapter-name, .unit-title, h4, h5, .title');
      const descEl = modEl.querySelector('.module-desc, .unit-description, p');
      
      const title = titleEl ? titleEl.textContent!.trim() : `Module ${idx + 1}`;
      const description = descEl ? descEl.textContent!.trim() : undefined;
      const moduleId = modEl.getAttribute('data-module-id') || `${courseId}-mod-${idx + 1}`;

      // Extract downloadable resources
      const resourceEls = modEl.querySelectorAll('a[href], .resource-item, .file-attachment');
      const resources: Resource[] = [];
      
      resourceEls.forEach((rEl, rIdx) => {
        const rTitle = rEl.textContent?.trim() || `Resource ${rIdx + 1}`;
        const href = (rEl as HTMLAnchorElement).href || undefined;
        const isPdf = rTitle.toLowerCase().includes('.pdf') || (href && href.includes('.pdf'));

        resources.push({
          id: `res-${moduleId}-${rIdx}`,
          title: rTitle,
          type: isPdf ? 'pdf' : 'document',
          url: href,
          isAccessible: true
        });
      });

      // Extract sub-topics
      const topicEls = modEl.querySelectorAll('.topic-name, li, .subtopic');
      const topics: string[] = [];
      topicEls.forEach((t) => {
        const tText = t.textContent?.trim();
        if (tText && tText.length > 2 && tText.length < 100) {
          topics.push(tText);
        }
      });

      modules.push({
        id: moduleId,
        courseId,
        number: idx + 1,
        title: title.replace(/^module\s*\d+[\s:—-]*/i, ''),
        description,
        topics: topics.length > 0 ? topics : ['Core Concepts', 'Practical Applications'],
        resourceCount: resources.length,
        resources
      });
    });

    return modules;
  }

  /**
   * Extract full text & accessible educational content for a specific module
   */
  static extractModuleContent(courseName: string, moduleTitle: string): { text: string; topics: string[]; resources: Resource[] } {
    // Find text nodes related to this module title in the document
    const bodyText = document.body.innerText;
    const lines = bodyText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    const relevantLines: string[] = [];
    let isCaptureZone = false;
    let linesCaptured = 0;

    for (const line of lines) {
      if (line.toLowerCase().includes(moduleTitle.toLowerCase())) {
        isCaptureZone = true;
      }

      if (isCaptureZone) {
        relevantLines.push(line);
        linesCaptured++;
        if (linesCaptured > 80 || (linesCaptured > 20 && line.toLowerCase().includes('module'))) {
          break;
        }
      }
    }

    const textContent = relevantLines.length > 5 ? relevantLines.join('\n') : bodyText.slice(0, 3000);

    // Extract links
    const linkEls = document.querySelectorAll('a[href]');
    const resources: Resource[] = [];
    linkEls.forEach((link, idx) => {
      const a = link as HTMLAnchorElement;
      if (a.href && (a.href.includes('.pdf') || a.href.includes('/download/') || a.innerText.toLowerCase().includes('notes'))) {
        resources.push({
          id: `extracted-res-${idx}`,
          title: a.innerText.trim() || `Document ${idx + 1}`,
          type: a.href.includes('.pdf') ? 'pdf' : 'document',
          url: a.href,
          isAccessible: true
        });
      }
    });

    return {
      text: textContent,
      topics: ['Overview', 'Core Syllabus Items', 'Learning Notes'],
      resources: resources.slice(0, 5)
    };
  }
}
