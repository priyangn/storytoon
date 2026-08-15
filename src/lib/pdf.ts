"use client";

import { jsPDF } from "jspdf";
import type { GeneratedComic } from "./types";
import { getTheme } from "./themes";

function dataUrlFormat(dataUrl: string): "PNG" | "JPEG" | "WEBP" {
  if (dataUrl.includes("image/jpeg") || dataUrl.includes("image/jpg")) return "JPEG";
  if (dataUrl.includes("image/webp")) return "WEBP";
  return "PNG";
}

/**
 * Export as a photo-comic strip: cover page + one 2×2 strip page (Fotojet-like layout).
 */
export function downloadComicPdf(comic: GeneratedComic): void {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const theme = getTheme(comic.themeId);
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 36;

  // —— Cover page ——
  doc.setFillColor(theme.accent);
  doc.rect(0, 0, pageW, 100, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("StoryToon Photo Comic", margin, 48);
  doc.setFontSize(18);
  doc.text(comic.title, margin, 78, { maxWidth: pageW - margin * 2 });

  if (comic.coverImageDataUrl) {
    try {
      doc.addImage(
        comic.coverImageDataUrl,
        dataUrlFormat(comic.coverImageDataUrl),
        margin,
        120,
        pageW - margin * 2,
        pageH * 0.52,
        undefined,
        "FAST"
      );
    } catch {
      // skip
    }
  }

  doc.setTextColor(40, 40, 40);
  doc.setFontSize(13);
  doc.text(`Starring ${comic.childName}`, margin, pageH - 90);
  if (comic.dedication) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(11);
    doc.text(comic.dedication, margin, pageH - 70, {
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

  // —— Comic strip page (2×2 grid) ——
  doc.addPage();
  doc.setFillColor(27, 58, 75);
  doc.rect(0, 0, pageW, pageH, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(`${comic.title} — Comic Strip`, margin, 28);

  const gutter = 10;
  const gridTop = 44;
  const gridBottomPad = 56;
  const cellW = (pageW - margin * 2 - gutter) / 2;
  const cellH = (pageH - gridTop - gridBottomPad - gutter) / 2;
  const imageH = cellH * 0.72;
  const textH = cellH - imageH;

  comic.panels.slice(0, 4).forEach((panel, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = margin + col * (cellW + gutter);
    const y = gridTop + row * (cellH + gutter);

    doc.setFillColor(255, 248, 240);
    doc.rect(x, y, cellW, cellH, "F");

    if (panel.imageDataUrl) {
      try {
        doc.addImage(
          panel.imageDataUrl,
          dataUrlFormat(panel.imageDataUrl),
          x + 4,
          y + 4,
          cellW - 8,
          imageH - 8,
          undefined,
          "FAST"
        );
      } catch {
        // skip
      }
    }

    doc.setFillColor(255, 248, 240);
    doc.rect(x, y + imageH, cellW, textH, "F");
    doc.setDrawColor(27, 58, 75);
    doc.setLineWidth(2);
    doc.rect(x, y, cellW, cellH);

    doc.setTextColor(27, 58, 75);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(`${index + 1}. ${panel.sceneLabel}`, x + 8, y + imageH + 14, {
      maxWidth: cellW - 16,
    });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(panel.caption, x + 8, y + imageH + 28, {
      maxWidth: cellW - 16,
    });
  });

  doc.setFontSize(8);
  doc.setTextColor(200, 210, 220);
  doc.text("Made with AI · StoryToon photo comic strip", margin, pageH - 24);

  doc.save(`StoryToon-${comic.childName.replace(/\s+/g, "-")}-comic-strip.pdf`);
}
