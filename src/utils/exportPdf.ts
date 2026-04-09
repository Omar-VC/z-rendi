// src/utils/exportPdf.ts
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Captura un elemento DOM y lo exporta a PDF.
 * - element: HTMLElement a capturar
 * - fileName: nombre del archivo resultante (sin extensión)
 * - options: { scale, margin, pageFormat } opcionales
 */
export async function exportElementToPdf(
  element: HTMLElement,
  fileName = "planilla",
  options?: {
    scale?: number;
    margin?: number; // mm
    pageFormat?: { widthMm: number; heightMm: number };
  }
) {
  const scale = options?.scale ?? 2; // mejora resolución
  const marginMm = options?.margin ?? 10;
  const pageFormat = options?.pageFormat ?? { widthMm: 210, heightMm: 297 }; // A4

  // Convert mm to px (approx) for layout calculations
  const pxPerMm = 96 / 25.4;
  const pageWidthPx = pageFormat.widthMm * pxPerMm;
  const pageHeightPx = pageFormat.heightMm * pxPerMm;
  const marginPx = marginMm * pxPerMm;

  // Render element to canvas
  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    allowTaint: true,
    logging: false,
  });

  const imgData = canvas.toDataURL("image/png");

  // Calculate image dimensions in PDF units (mm)
  const pdf = new jsPDF({
    unit: "mm",
    format: [pageFormat.widthMm, pageFormat.heightMm],
  });

  const imgWidthMm = (canvas.width / pxPerMm) * (1 / scale);
  const imgHeightMm = (canvas.height / pxPerMm) * (1 / scale);

  // If image height fits in one page (considering margins), just add it
  const printableWidth = pageFormat.widthMm - marginMm * 2;
  const printableHeight = pageFormat.heightMm - marginMm * 2;

  // Scale image to printable width
  const scaleFactor = Math.min(printableWidth / imgWidthMm, 1);
  const finalImgWidth = imgWidthMm * scaleFactor;
  const finalImgHeight = imgHeightMm * scaleFactor;

  // If finalImgHeight <= printableHeight => single page
  if (finalImgHeight <= printableHeight) {
    const x = (pageFormat.widthMm - finalImgWidth) / 2;
    const y = marginMm;
    pdf.addImage(imgData, "PNG", x, y, finalImgWidth, finalImgHeight);
    pdf.save(`${fileName}.pdf`);
    return;
  }

  // Multi-page: slice the canvas vertically
  // Convert final image height in px to page slices in px
  const finalImgWidthPx = finalImgWidth * pxPerMm * scale;
  const finalImgHeightPx = finalImgHeight * pxPerMm * scale;
  const sliceHeightPx = printableHeight * pxPerMm * scale;

  let yOffsetPx = 0;
  let page = 0;
  while (yOffsetPx < canvas.height) {
    // create a temporary canvas for the slice
    const sliceCanvas = document.createElement("canvas");
    sliceCanvas.width = canvas.width;
    sliceCanvas.height = Math.min(sliceHeightPx, canvas.height - yOffsetPx);
    const ctx = sliceCanvas.getContext("2d")!;
    ctx.drawImage(
      canvas,
      0,
      yOffsetPx,
      canvas.width,
      sliceCanvas.height,
      0,
      0,
      canvas.width,
      sliceCanvas.height
    );
    const sliceData = sliceCanvas.toDataURL("image/png");

    const sliceHeightMm = (sliceCanvas.height / pxPerMm) * (1 / scale);
    const x = (pageFormat.widthMm - finalImgWidth) / 2;
    const y = marginMm;

    if (page > 0) pdf.addPage();
    pdf.addImage(sliceData, "PNG", x, y, finalImgWidth, sliceHeightMm);
    page++;
    yOffsetPx += sliceCanvas.height;
  }

  pdf.save(`${fileName}.pdf`);
}
