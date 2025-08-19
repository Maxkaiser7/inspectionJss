import { Buffer } from 'buffer';
import * as FileSystem from 'expo-file-system';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

global.Buffer = global.Buffer || Buffer;

export const generatePdf = async ({ clientName, address, date, photoUri, buildingType, floor }) => {
  try {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 14;

    const pageWidth = 595;
    const pageHeight = 842;
    const margin = 50;

    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    let cursorY = pageHeight - margin;

    // Texte en haut
    page.drawText("Rapport d'inspection", {
      x: margin,
      y: cursorY,
      size: 18,
      font,
      color: rgb(0, 0, 0),
    });

    cursorY -= 30;
    page.drawText(`Nom du client : ${clientName}`, { x: margin, y: cursorY, size: fontSize, font });

    cursorY -= 20;
    page.drawText(`Adresse : ${address}`, { x: margin, y: cursorY, size: fontSize, font });

    cursorY -= 20;
    page.drawText(`Date : ${date}`, { x: margin, y: cursorY, size: fontSize, font });
    page.drawText(`Type de bâtiment : ${buildingType}`, { x: 50, y: height - 140, size: fontSize, font });

    if (buildingType === "appartement" && floor) {
      page.drawText(`Étage : ${floor}`, { x: 50, y: height - 160, size: fontSize, font });
    }
    
    cursorY -= 40;

    // Lecture et ajout de l'image
    const imageBytes = await FileSystem.readAsStringAsync(photoUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const imageBuffer = Buffer.from(imageBytes, 'base64');
    const image = await pdfDoc.embedJpg(imageBuffer); // ou embedPng

    const originalWidth = image.width;
    const originalHeight = image.height;

    const maxImageWidth = pageWidth - 2 * margin;
    const maxImageHeight = 300;

    let imgWidth = originalWidth;
    let imgHeight = originalHeight;

    // Mise à l’échelle
    if (imgWidth > maxImageWidth) {
      const ratio = maxImageWidth / imgWidth;
      imgWidth *= ratio;
      imgHeight *= ratio;
    }

    if (imgHeight > maxImageHeight) {
      const ratio = maxImageHeight / imgHeight;
      imgWidth *= ratio;
      imgHeight *= ratio;
    }

    const x = (pageWidth - imgWidth) / 2;
    const y = cursorY - imgHeight;

    // Dessin de l’image
    page.drawImage(image, {
      x,
      y,
      width: imgWidth,
      height: imgHeight,
    });

    // Sauvegarde
    const pdfBytes = await pdfDoc.save();
    const base64Pdf = Buffer.from(pdfBytes).toString('base64');
    const pdfPath = `${FileSystem.documentDirectory}rapport-inspection-${Date.now()}.pdf`;

    await FileSystem.writeAsStringAsync(pdfPath, base64Pdf, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log('✅ PDF généré à :', pdfPath);
    return pdfPath;
  } catch (error) {
    console.error("❌ Erreur génération PDF :", error);
    throw error;
  }
};
