import fs from 'node:fs';
import path from 'node:path';
import PDFDocument from 'pdfkit';

interface ReportInput {
  orgName: string;
  weekOf: string;
  highlights: Array<{ label: string; value: string }>;
}

function generateReport(input: ReportInput) {
  const doc = new PDFDocument();
  const outputPath = path.join(process.cwd(), `report-${input.weekOf}.pdf`);
  doc.pipe(fs.createWriteStream(outputPath));
  doc.fontSize(20).text('Sentinel AU Weekly Summary', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Organisation: ${input.orgName}`);
  doc.text(`Week of: ${input.weekOf}`);
  doc.moveDown();
  input.highlights.forEach((highlight) => {
    doc.text(`${highlight.label}: ${highlight.value}`);
  });
  doc.end();
  console.log(`Generated ${outputPath}`);
}

if (require.main === module) {
  generateReport({
    orgName: 'Sentinel AU Demo Family',
    weekOf: '2024-08-19',
    highlights: [
      { label: 'Most visited domain', value: 'abc.net.au/kidsnews' },
      { label: 'Top app', value: 'Google Classroom (4h 12m)' }
    ]
  });
}
