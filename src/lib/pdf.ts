"use client";

import { jsPDF } from "jspdf";
import type { GeneratedComic } from "./types";
import { getTheme } from "./themes";

function dataUrlFormat(dataUrl: string): "PNG" | "JPEG" | "WEBP" {
  if (dataUrl.includes("image/jpeg") || dataUrl.includes("image/jpg")) return "JPEG";
  if (dataUrl.includes("image/webp")) return "WEBP";
  return "PNG";
}

export function downloadComicPdf(comic: GeneratedComic): void {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const theme = getTheme(comic.themeId);
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 40;

  // Cover
  doc.setFillColor(theme.accent);
  doc.rect(0, 0, pageW, pageH * 0.28, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.text("StoryToon", margin, 56);
  doc.setFontSize(20);
  doc.text(comic.title, margin, 88, { maxWidth: pageW - margin * 2 });
  doc.setFontSize(13);
  doc.text(`Starring ${comic.childName}`, margin, 118);

  if (comic.coverImageDataUrl) {
    try {
      const fmt = dataUrlFormat(comic.coverImageDataUrl);
      doc.addImage(
        comic.coverImageDataUrl,
        fmt,
        margin,
        140,
        pageW - margin * 2,
        pageH * 0.48,
        undefined,
        "FAST"
      );
    } catch {
      // skip broken image
    }
  }

  doc.setTextColor(40, 40, 40);
  if (comic.dedication) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(12);
    doc.text(comic.dedication, margin, pageH - 72, {
      maxWidth: pageW - margin * 2,
    });
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text("Made with AI", margin, pageH - 44);
  doc.text(comic.modelAttribution, margin, pageH - 28, {
    maxWidth: pageW - margin * 2,
  });

  comic.panels.forEach((panel, index) => {
    doc.addPage();
    doc.setFillColor(245, 247, 250);
    doc.rect(0, 0, pageW, pageH, "F");

    doc.setTextColor(theme.accent);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`Panel ${index + 1}: ${panel.sceneLabel}`, margin, margin);

    if (panel.imageDataUrl) {
      try {
        const fmt = dataUrlFormat(panel.imageDataUrl);
        doc.addImage(
          panel.imageDataUrl,
          fmt,
          margin,
          margin + 16,
          pageW - margin * 2,
          pageH * 0.55,
          undefined,
          "FAST"
        );
      } catch {
        // skip
      }
    }

    doc.setTextColor(50, 50, 50);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(panel.caption, margin, pageH - 80, {
      maxWidth: pageW - margin * 2,
    });

    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text("Made with AI · StoryToon", margin, pageH - 40);
  });

  doc.save(`StoryToon-${comic.childName.replace(/\s+/g, "-")}.pdf`);
}
