import { Buffer } from 'buffer';
import * as FileSystem from 'expo-file-system';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

global.Buffer = global.Buffer || Buffer;

export const generatePdf = async ({ clientName, address, photoUri, date }) => {
  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4

    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 14;

    page.drawText(`Rapport d'inspection`, {
      x: 50,
      y: height - 50,
      size: 18,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Nom du client : ${clientName}`, { x: 50, y: height - 80, size: fontSize, font });
    page.drawText(`Adresse : ${address}`, { x: 50, y: height - 100, size: fontSize, font });
    page.drawText(`Date : ${date}`, { x: 50, y: height - 120, size: fontSize, font });

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
