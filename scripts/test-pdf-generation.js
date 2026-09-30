import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { jsPDF } from 'jspdf';
import { applyPlugin } from 'jspdf-autotable';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPdfPath = path.join(__dirname, '../sample_generated_notes.pdf');

console.log('Testing academic PDF generation...');

applyPlugin(jsPDF);

const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'mm',
  format: 'a4'
});

const pageWidth = doc.internal.pageSize.getWidth();
const margin = 15;

// Header banner
doc.setFillColor(15, 23, 42); // #0f172a
doc.rect(0, 0, pageWidth, 42, 'F');

doc.setFont('helvetica', 'bold');
doc.setFontSize(9);
doc.setTextColor(148, 163, 184);
doc.text("DIGIICAMPUS ACADEMIC STUDY ASSISTANT", margin, 12);

doc.setFontSize(16);
doc.setTextColor(255, 255, 255);
doc.text("CS-301 Computer Networks", margin, 21);

doc.setFont('helvetica', 'normal');
doc.setFontSize(11);
doc.setTextColor(226, 232, 240);
doc.text("Module 2 — Data Link Layer & Error Control", margin, 29);

doc.setFontSize(8.5);
doc.setTextColor(148, 163, 184);
doc.text("Type: DETAILED NOTES | Generated: 2026-09-28", margin, 36);

// AutoTable for Key Definitions
doc.autoTable({
  startY: 55,
  head: [['Academic Term', 'Precise Definition']],
  body: [
    ['Cyclic Redundancy Check (CRC)', 'An error-detecting code based on polynomial division used to detect accidental changes to raw data in digital networks.'],
    ['Sliding Window Protocol', 'A flow-control algorithm that allows a sender to transmit multiple data packets before waiting for an acknowledgement.'],
    ['Framing', 'The process of dividing bit streams into discrete units of data called frames with delimiting header and trailer flags.']
  ],
  theme: 'striped',
  headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255] }
});

const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
fs.writeFileSync(outputPdfPath, pdfBuffer);

console.log(`✅ SUCCESS: PDF generated at ${outputPdfPath} (${pdfBuffer.length} bytes)`);

// Verify PDF signature
const fileHead = fs.readFileSync(outputPdfPath, { encoding: 'ascii', flag: 'r' }).slice(0, 5);
if (fileHead === '%PDF-') {
  console.log('✅ PASS: Valid %PDF- binary header confirmed.');
} else {
  console.error('❌ FAIL: Invalid PDF signature.');
  process.exit(1);
}
