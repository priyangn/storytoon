"use client";

import { jsPDF } from "jspdf";
import type { GeneratedComic } from "./types";
import { getTheme } from "./themes";

export function downloadComicPdf(comic: GeneratedComic): void {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const theme = getTheme(comic.themeId);
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;

  // Cover
  doc.setFillColor(theme.accent);
  doc.rect(0, 0, pageW, pageH * 0.38, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.text("StoryToon", margin, 72);
  doc.setFontSize(22);
  doc.text(comic.title, margin, 110, { maxWidth: pageW - margin * 2 });
  doc.setFontSize(14);
  doc.text(`Starring ${comic.childName}`, margin, 145);

  doc.setTextColor(40, 40, 40);
  if (comic.dedication) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(12);
    doc.text(comic.dedication, margin, pageH * 0.45, {
      maxWidth: pageW - margin * 2,
    });
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("Made with AI", margin, pageH - 56);
  doc.text(comic.modelAttribution, margin, pageH - 40, {
    maxWidth: pageW - margin * 2,
  });

  // Panels
  comic.panels.forEach((panel, index) => {
    doc.addPage();
    doc.setFillColor(245, 247, 250);
    doc.rect(0, 0, pageW, pageH, "F");
    doc.setDrawColor(theme.accent);
    doc.setLineWidth(3);
    doc.roundedRect(margin, margin, pageW - margin * 2, pageH * 0.55, 12, 12);

    doc.setTextColor(theme.accent);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`Panel ${index + 1}: ${panel.sceneLabel}`, margin + 16, margin + 36);

    doc.setTextColor(50, 50, 50);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.text(panel.caption, margin + 16, margin + 70, {
      maxWidth: pageW - margin * 2 - 32,
    });

    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text("Made with AI · StoryToon", margin, pageH - 40);
  });

  doc.save(`StoryToon-${comic.childName.replace(/\s+/g, "-")}.pdf`);
}
