import { jsPDF } from 'jspdf';
import { ComicStory } from '../types/comic';

export function generateComicPdf(comic: ComicStory): void {
  // A4 Page dimensions: 210 x 297 mm
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // ================= PAGE 1: COVER & ISSUE METADATA =================
  // Dark Background for cover
  doc.setFillColor(15, 16, 22);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Comic Header Border
  doc.setDrawColor(245, 158, 11); // Amber
  doc.setLineWidth(1.5);
  doc.rect(margin - 4, margin - 4, contentWidth + 8, pageHeight - (margin * 2) + 8);

  // Top Banner
  doc.setFillColor(245, 158, 11);
  doc.rect(margin, margin, contentWidth, 14, 'F');
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('COMICCRAFT PRESENTATION EDITION', margin + 4, margin + 9.5);

  doc.setFontSize(10);
  doc.text(comic.issueNumber?.toUpperCase() || 'ISSUE #1', pageWidth - margin - 4, margin + 9.5, { align: 'right' });

  // Main Comic Title
  doc.setTextColor(245, 158, 11);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.text(comic.title.toUpperCase(), margin, margin + 34);

  // Tagline
  doc.setTextColor(220, 225, 235);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(12);
  const splitTagline = doc.splitTextToSize(`"${comic.tagline}"`, contentWidth);
  doc.text(splitTagline, margin, margin + 44);

  let currentY = margin + 56;

  // Metadata Badges (Genre, Style, Tone, Setting)
  doc.setFillColor(30, 41, 59);
  doc.rect(margin, currentY, contentWidth, 20, 'F');
  doc.setDrawColor(71, 85, 105);
  doc.rect(margin, currentY, contentWidth, 20);

  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`GENRE: ${comic.genre || 'Action'}`, margin + 4, currentY + 7);
  doc.text(`STYLE: ${comic.artStyle || 'Graphic Novel'}`, margin + 4, currentY + 14);
  doc.text(`SETTING: ${comic.setting || 'Not specified'}`, margin + contentWidth / 2, currentY + 7);
  doc.text(`TONE: ${comic.tone || 'Cinematic'}`, margin + contentWidth / 2, currentY + 14);

  currentY += 28;

  // Synopsis Box
  doc.setFillColor(24, 24, 27);
  doc.rect(margin, currentY, contentWidth, 32, 'F');
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(0.8);
  doc.rect(margin, currentY, contentWidth, 32);

  doc.setTextColor(245, 158, 11);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('PREMISE & SYNOPSIS', margin + 4, currentY + 7);

  doc.setTextColor(241, 245, 249);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  const splitSynopsis = doc.splitTextToSize(comic.synopsis, contentWidth - 8);
  doc.text(splitSynopsis, margin + 4, currentY + 14);

  currentY += 40;

  // Cast of Characters Section
  doc.setTextColor(6, 182, 212); // Cyan
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('DRAMATIS PERSONAE (CAST OF CHARACTERS)', margin, currentY);
  currentY += 7;

  comic.characters.slice(0, 3).forEach((char) => {
    doc.setFillColor(20, 24, 39);
    doc.rect(margin, currentY, contentWidth, 24, 'F');
    doc.setDrawColor(51, 65, 85);
    doc.setLineWidth(0.5);
    doc.rect(margin, currentY, contentWidth, 24);

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(char.name.toUpperCase(), margin + 4, currentY + 6);

    doc.setTextColor(245, 158, 11);
    doc.setFontSize(8.5);
    doc.text(`[${char.role}]`, margin + 65, currentY + 6);

    doc.setTextColor(203, 213, 225);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    const desc = doc.splitTextToSize(`Appearance: ${char.visualDescription}`, contentWidth - 8);
    doc.text(desc, margin + 4, currentY + 12);

    if (char.catchphrase) {
      doc.setTextColor(103, 232, 249);
      doc.setFont('helvetica', 'italic');
      doc.text(`"${char.catchphrase}"`, margin + 4, currentY + 20);
    }

    currentY += 27;
  });

  // Footer on cover
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Created with ComicCraft • Powered by Google Gemini', pageWidth / 2, pageHeight - 8, { align: 'center' });

  // ================= PAGES 2+: COMIC PANELS =================
  // We'll print 2 to 3 panels per page with comic styling
  let panelIndex = 0;
  while (panelIndex < comic.panels.length) {
    doc.addPage();

    // White page with comic book page border
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1.2);
    doc.rect(margin - 2, margin - 2, contentWidth + 4, pageHeight - (margin * 2) + 4);

    // Page Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`${comic.title.toUpperCase()} — ${comic.issueNumber || 'ISSUE #1'}`, margin, margin + 3);
    const pageNum = doc.getNumberOfPages();
    doc.text(`PAGE ${pageNum}`, pageWidth - margin, margin + 3, { align: 'right' });

    let panelY = margin + 8;
    const panelsOnThisPage = comic.panels.slice(panelIndex, panelIndex + 2);

    panelsOnThisPage.forEach((panel) => {
      const pHeight = 115;

      // Outer panel frame (heavy black comic border)
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, panelY, contentWidth, pHeight, 'F');
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(1.5);
      doc.rect(margin, panelY, contentWidth, pHeight);

      // Panel Header Tab (Panel Number & Camera Angle)
      doc.setFillColor(0, 0, 0);
      doc.rect(margin, panelY, 40, 7, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text(`PANEL #${panel.panelNumber} ${panel.beatTitle ? `• ${panel.beatTitle}` : ''}`, margin + 2, panelY + 5);

      doc.setTextColor(80, 80, 80);
      doc.setFontSize(7.5);
      doc.text(`${panel.cameraAngle || 'Wide Shot'} • ${panel.setting || 'Scene'}`, pageWidth - margin - 3, panelY + 5, { align: 'right' });

      let innerY = panelY + 12;

      // Narration Box (Yellow caption)
      if (panel.narration) {
        doc.setFillColor(254, 240, 138); // Yellow-200
        doc.rect(margin + 4, innerY, contentWidth - 8, 14, 'F');
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.8);
        doc.rect(margin + 4, innerY, contentWidth - 8, 14);

        doc.setTextColor(113, 63, 18);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        const splitNarr = doc.splitTextToSize(`CAPTION: "${panel.narration}"`, contentWidth - 12);
        doc.text(splitNarr, margin + 6, innerY + 5.5);
        innerY += 17;
      }

      // Action & Staging Description
      doc.setFillColor(241, 245, 249);
      doc.rect(margin + 4, innerY, contentWidth - 8, 16, 'F');
      doc.setDrawColor(148, 163, 184);
      doc.setLineWidth(0.5);
      doc.rect(margin + 4, innerY, contentWidth - 8, 16);

      doc.setTextColor(51, 65, 85);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      const splitAction = doc.splitTextToSize(`ACTION: ${panel.actionDescription}`, contentWidth - 12);
      doc.text(splitAction, margin + 6, innerY + 5);
      innerY += 19;

      // Sound Effect Decal (SFX) if present
      if (panel.sfx) {
        doc.setFillColor(239, 68, 68); // Red
        doc.rect(pageWidth - margin - 35, innerY - 2, 30, 8, 'F');
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.8);
        doc.rect(pageWidth - margin - 35, innerY - 2, 30, 8);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text(panel.sfx.text, pageWidth - margin - 20, innerY + 3.5, { align: 'center' });
      }

      // Dialogues / Speech Balloons
      if (panel.dialogues && panel.dialogues.length > 0) {
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.text('DIALOGUES:', margin + 6, innerY + 2);
        innerY += 5;

        panel.dialogues.slice(0, 3).forEach((d) => {
          doc.setFillColor(255, 255, 255);
          doc.roundedRect(margin + 6, innerY, contentWidth - 12, 11, 2, 2, 'F');
          doc.setDrawColor(0, 0, 0);
          doc.setLineWidth(0.7);
          doc.roundedRect(margin + 6, innerY, contentWidth - 12, 11, 2, 2);

          doc.setTextColor(15, 23, 42);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.text(`${d.speaker.toUpperCase()} (${d.type}):`, margin + 9, innerY + 4.5);

          doc.setFont('helvetica', 'normal');
          doc.text(`"${d.text}"`, margin + 9, innerY + 8.5);

          innerY += 13;
        });
      }

      panelY += pHeight + 7;
    });

    panelIndex += 2;
  }

  // Trigger browser download
  const cleanTitle = comic.title.replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`${cleanTitle}_ComicCraft_Edition.pdf`);
}
