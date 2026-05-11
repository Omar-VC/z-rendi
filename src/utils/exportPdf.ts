import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function exportElementToPdf(
  element: HTMLElement,
  fileName = "planilla",
  options?: {
    scale?: number;
    margin?: number;
    pageFormat?: { widthMm: number; heightMm: number };
  }
) {
  const scale = options?.scale ?? 2;
  const marginMm = options?.margin ?? 10;
  const pageFormat = options?.pageFormat ?? { widthMm: 210, heightMm: 297 };

  const pxPerMm = 96 / 25.4;

  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    allowTaint: true,
    logging: false,
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    unit: "mm",
    format: [pageFormat.widthMm, pageFormat.heightMm],
  });

  const imgWidthMm = (canvas.width / pxPerMm) * (1 / scale);
  const imgHeightMm = (canvas.height / pxPerMm) * (1 / scale);

  const printableWidth = pageFormat.widthMm - marginMm * 2;
  const printableHeight = pageFormat.heightMm - marginMm * 2;

  const scaleFactor = Math.min(printableWidth / imgWidthMm, 1);
  const finalImgWidth = imgWidthMm * scaleFactor;
  const finalImgHeight = imgHeightMm * scaleFactor;

  if (finalImgHeight <= printableHeight) {
    const x = (pageFormat.widthMm - finalImgWidth) / 2;
    const y = marginMm;

    pdf.addImage(imgData, "PNG", x, y, finalImgWidth, finalImgHeight);
    pdf.save(`${fileName}.pdf`);
    return;
  }

  const sliceHeightPx = printableHeight * pxPerMm * scale;

  let yOffsetPx = 0;
  let page = 0;

  while (yOffsetPx < canvas.height) {
    const sliceCanvas = document.createElement("canvas");
    sliceCanvas.width = canvas.width;
    sliceCanvas.height = Math.min(
      sliceHeightPx,
      canvas.height - yOffsetPx
    );

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
