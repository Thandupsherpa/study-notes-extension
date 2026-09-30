import { jsPDF } from 'jspdf';
import autoTable, { applyPlugin } from 'jspdf-autotable';
import { GeneratedNotes } from '../types';

// Ensure autoTable plugin is registered on jsPDF prototype
try {
  if (typeof applyPlugin === 'function') {
    applyPlugin(jsPDF);
  }
} catch (e) {
  console.warn('[pdfGenerator] autoTable plugin initialization note:', e);
}

function renderTable(doc: any, options: any) {
  if (typeof doc.autoTable === 'function') {
    doc.autoTable(options);
  } else if (typeof autoTable === 'function') {
    (autoTable as any)(doc, options);
  } else if ((autoTable as any)?.default) {
    (autoTable as any).default(doc, options);
  }
}

export const pdfGenerator = {
  /**
   * Generate a formatted academic PDF document from GeneratedNotes
   */
  async generatePdf(notes: GeneratedNotes): Promise<{ blob: Blob; filename: string; dataUrl: string }> {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    let yPos = margin;

    // Helper: Format filename
    const sanitize = (str: string) => str.replace(/[^a-zA-Z0-9_\-]/g, '_').replace(/_+/g, '_');
    const filename = `${sanitize(notes.courseName)}_${sanitize(notes.moduleTitle)}_Notes.pdf`;

    // Colors matching academic design system
    const primaryNavy = [23, 37, 84];     // #172554 Navy
    const deepNavy = [15, 23, 42];        // #0F172A Deep Navy
    const indigo = [79, 70, 229];         // #4F46E5 Indigo Accent
    const softIndigo = [238, 242, 255];   // #EEF2FF Soft Indigo
    const textColor = [71, 85, 105];      // #475569 Gray Body Text
    const primaryColor = deepNavy;
    const accentColor = indigo;
    const lightBg = softIndigo;
    const darkHeaderBg = primaryNavy;

    // Helper: Check page overflow
    const checkPageBreak = (neededHeight: number) => {
      if (yPos + neededHeight > pageHeight - 18) {
        doc.addPage();
        yPos = margin + 10;
      }
    };

    // Helper: Section Header Block
    const renderSectionHeader = (title: string) => {
      checkPageBreak(14);
      doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.rect(margin, yPos, 3, 7, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(title, margin + 6, yPos + 5.5);

      yPos += 10;
    };

    // --- 1. ACADEMIC COVER HEADER BANNER ---
    doc.setFillColor(darkHeaderBg[0], darkHeaderBg[1], darkHeaderBg[2]);
    doc.rect(0, 0, pageWidth, 42, 'F');

    // Header Badge / Subtitle
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184); // #94a3b8
    doc.text("DIGIICAMPUS ACADEMIC STUDY ASSISTANT", margin, 12);

    // Document Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text(notes.courseName, margin, 21);

    // Module Subtitle
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(226, 232, 240);
    doc.text(notes.moduleTitle, margin, 29);

    // Date & Type Badge
    doc.setFontSize(8.5);
    doc.setTextColor(148, 163, 184);
    doc.text(`Type: ${notes.noteType.toUpperCase()} NOTES  |  Generated: ${notes.generatedAt}`, margin, 36);

    yPos = 50;

    // --- 2. MODULE OVERVIEW ---
    renderSectionHeader("1. Module Overview");
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);

    const overviewLines = doc.splitTextToSize(notes.overview, contentWidth);
    checkPageBreak(overviewLines.length * 4.5 + 4);
    doc.text(overviewLines, margin, yPos);
    yPos += overviewLines.length * 4.5 + 6;

    // --- 3. LEARNING OBJECTIVES ---
    if (notes.learningObjectives && notes.learningObjectives.length > 0) {
      renderSectionHeader("2. Learning Objectives");
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);

      notes.learningObjectives.forEach((obj) => {
        const lines = doc.splitTextToSize(`•  ${obj}`, contentWidth - 4);
        checkPageBreak(lines.length * 4.5 + 2);
        doc.text(lines, margin + 2, yPos);
        yPos += lines.length * 4.5 + 2;
      });
      yPos += 4;
    }

    // --- 4. KEY CONCEPTS BOX ---
    if (notes.keyConcepts && notes.keyConcepts.length > 0) {
      renderSectionHeader("3. Core Concepts");

      doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
      const boxHeight = Math.ceil(notes.keyConcepts.length / 2) * 6 + 6;
      checkPageBreak(boxHeight);

      doc.roundedRect(margin, yPos, contentWidth, boxHeight, 2, 2, 'F');
      yPos += 5;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);

      notes.keyConcepts.forEach((concept, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const xPos = margin + 4 + col * (contentWidth / 2);
        const currentY = yPos + row * 6;
        doc.text(`▸  ${concept}`, xPos, currentY);
      });

      yPos += Math.ceil(notes.keyConcepts.length / 2) * 6 + 6;
    }

    // --- 5. DETAILED EXPLANATIONS ---
    if (notes.detailedExplanations && notes.detailedExplanations.length > 0) {
      renderSectionHeader("4. Detailed Explanations");

      notes.detailedExplanations.forEach((item) => {
        checkPageBreak(12);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10.5);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text(item.heading, margin, yPos);
        yPos += 5.5;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);

        const expLines = doc.splitTextToSize(item.explanation, contentWidth);
        checkPageBreak(expLines.length * 4.5 + 3);
        doc.text(expLines, margin, yPos);
        yPos += expLines.length * 4.5 + 3;

        if (item.subpoints && item.subpoints.length > 0) {
          item.subpoints.forEach((sub) => {
            const subLines = doc.splitTextToSize(`- ${sub}`, contentWidth - 6);
            checkPageBreak(subLines.length * 4 + 2);
            doc.text(subLines, margin + 4, yPos);
            yPos += subLines.length * 4 + 2;
          });
        }
        yPos += 4;
      });
    }

    // --- 6. IMPORTANT DEFINITIONS TABLE ---
    if (notes.importantDefinitions && notes.importantDefinitions.length > 0) {
      renderSectionHeader("5. Key Terms & Definitions");

      const tableData = notes.importantDefinitions.map(def => [def.term, def.definition]);
      renderTable(doc, {
        startY: yPos,
        head: [['Term / Keyword', 'Academic Definition']],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: [30, 41, 59],
          textColor: [255, 255, 255],
          fontSize: 9.5,
          fontStyle: 'bold'
        },
        bodyStyles: {
          fontSize: 8.5,
          textColor: [51, 65, 85]
        },
        columnStyles: {
          0: { cellWidth: 45, fontStyle: 'bold' },
          1: { cellWidth: 'auto' }
        },
        margin: { left: margin, right: margin }
      });

      yPos = (doc as any).lastAutoTable.finalY + 8;
    }

    // --- 7. COMPARISONS TABLE ---
    if (notes.comparisons && notes.comparisons.length > 0) {
      renderSectionHeader("6. Concept Comparisons");

      const compData = notes.comparisons.map(c => [c.conceptA, c.conceptB, c.keyDifferences]);
      renderTable(doc, {
        startY: yPos,
        head: [['Concept A', 'Concept B', 'Key Distinction']],
        body: compData,
        theme: 'grid',
        headStyles: {
          fillColor: [37, 99, 235],
          textColor: [255, 255, 255],
          fontSize: 9,
          fontStyle: 'bold'
        },
        bodyStyles: {
          fontSize: 8.5
        },
        margin: { left: margin, right: margin }
      });

      yPos = (doc as any).lastAutoTable.finalY + 8;
    }

    // --- 8. PRACTICAL EXAMPLES ---
    if (notes.examples && notes.examples.length > 0) {
      renderSectionHeader("7. Worked Examples & Solved Problems");

      notes.examples.forEach((ex) => {
        checkPageBreak(25);

        doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
        doc.rect(margin, yPos, contentWidth, 6, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
        doc.text(`Example: ${ex.title}`, margin + 3, yPos + 4.5);
        yPos += 8;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text('Problem:', margin + 2, yPos);
        yPos += 4;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        const probLines = doc.splitTextToSize(ex.problem, contentWidth - 4);
        checkPageBreak(probLines.length * 4);
        doc.text(probLines, margin + 2, yPos);
        yPos += probLines.length * 4 + 2;

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
        doc.text('Solution:', margin + 2, yPos);
        yPos += 4;

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        const solLines = doc.splitTextToSize(ex.solution, contentWidth - 4);
        checkPageBreak(solLines.length * 4);
        doc.text(solLines, margin + 2, yPos);
        yPos += solLines.length * 4 + 6;
      });
    }

    // --- 9. FORMULAS & EQUATIONS ---
    if (notes.formulasAndEquations && notes.formulasAndEquations.length > 0) {
      renderSectionHeader("8. Key Formulas & Equations");

      const formulaData = notes.formulasAndEquations.map(f => [f.name, f.formula, f.explanation]);
      renderTable(doc, {
        startY: yPos,
        head: [['Formula Name', 'Equation / Notation', 'Explanation & Variables']],
        body: formulaData,
        theme: 'striped',
        headStyles: {
          fillColor: [30, 41, 59],
          textColor: [255, 255, 255],
          fontSize: 9
        },
        bodyStyles: {
          fontSize: 8.5
        },
        columnStyles: {
          1: { fontStyle: 'bold', textColor: [37, 99, 235] }
        },
        margin: { left: margin, right: margin }
      });

      yPos = (doc as any).lastAutoTable.finalY + 8;
    }

    // --- 10. QUICK REVISION & EXAM QUESTIONS ---
    if (notes.quickRevisionPoints && notes.quickRevisionPoints.length > 0) {
      renderSectionHeader("9. Quick Revision Points");
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);

      notes.quickRevisionPoints.forEach((pt) => {
        const lines = doc.splitTextToSize(`✓  ${pt}`, contentWidth - 4);
        checkPageBreak(lines.length * 4 + 2);
        doc.text(lines, margin + 2, yPos);
        yPos += lines.length * 4 + 2;
      });
      yPos += 4;
    }

    if (notes.importantQuestions && notes.importantQuestions.length > 0) {
      renderSectionHeader("10. Important Exam Questions");

      notes.importantQuestions.forEach((q, idx) => {
        checkPageBreak(15);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text(`Q${idx + 1}. ${q.question} ${q.marks ? `[${q.marks} Marks]` : ''}`, margin, yPos);
        yPos += 4.5;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        const ansLines = doc.splitTextToSize(`Ans outline: ${q.suggestedAnswer}`, contentWidth - 4);
        checkPageBreak(ansLines.length * 4);
        doc.text(ansLines, margin + 4, yPos);
        yPos += ansLines.length * 4 + 4;
      });
    }

    // --- PAGE FOOTERS & PAGE NUMBERS ---
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      
      // Top line on pages > 1
      if (i > 1) {
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.3);
        doc.line(margin, 10, pageWidth - margin, 10);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(148, 163, 184);
        doc.text(`${notes.courseName} — ${notes.moduleTitle}`, margin, 8);
      }

      // Bottom Footer
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text("Digiicampus Study Assistant", margin, pageHeight - 7);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
    }

    const pdfBlob = doc.output('blob');
    const dataUrl = doc.output('datauristring');

    return {
      blob: pdfBlob,
      filename,
      dataUrl
    };
  }
};
