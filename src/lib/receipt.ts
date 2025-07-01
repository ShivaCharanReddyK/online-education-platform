import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

interface ReceiptData {
  receiptNumber: string;
  date: string;
  customerName: string;
  customerEmail: string;
  programTitle: string;
  amount: number;
  paymentType: string;
  referenceNumber: string;
}

export async function generateReceipt(data: ReceiptData): Promise<string> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
  
  // Get fonts
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Set margins
  const margin = 50;
  const width = page.getWidth() - 2 * margin;
  
  // Draw header
  page.drawText('LearnFlow Education Platform', {
    x: margin,
    y: page.getHeight() - margin,
    size: 24,
    font: helveticaBold,
    color: rgb(0.2, 0.3, 0.7),
  });
  
  page.drawText('PAYMENT RECEIPT', {
    x: margin,
    y: page.getHeight() - margin - 40,
    size: 18,
    font: helveticaBold,
  });
  
  // Draw receipt info
  const infoStartY = page.getHeight() - margin - 80;
  const lineHeight = 25;
  
  page.drawText(`Receipt Number: ${data.receiptNumber}`, {
    x: margin,
    y: infoStartY,
    size: 12,
    font: helveticaFont,
  });
  
  page.drawText(`Date: ${new Date(data.date).toLocaleDateString()}`, {
    x: margin,
    y: infoStartY - lineHeight,
    size: 12,
    font: helveticaFont,
  });
  
  page.drawText(`Reference Number: ${data.referenceNumber}`, {
    x: margin,
    y: infoStartY - lineHeight * 2,
    size: 12,
    font: helveticaFont,
  });
  
  // Customer info
  const customerStartY = infoStartY - lineHeight * 4;
  
  page.drawText('Customer Information:', {
    x: margin,
    y: customerStartY,
    size: 14,
    font: helveticaBold,
  });
  
  page.drawText(`Name: ${data.customerName}`, {
    x: margin,
    y: customerStartY - lineHeight,
    size: 12,
    font: helveticaFont,
  });
  
  page.drawText(`Email: ${data.customerEmail}`, {
    x: margin,
    y: customerStartY - lineHeight * 2,
    size: 12,
    font: helveticaFont,
  });
  
  // Payment details
  const paymentStartY = customerStartY - lineHeight * 4;
  
  page.drawText('Payment Details:', {
    x: margin,
    y: paymentStartY,
    size: 14,
    font: helveticaBold,
  });
  
  page.drawText(`Program: ${data.programTitle}`, {
    x: margin,
    y: paymentStartY - lineHeight,
    size: 12,
    font: helveticaFont,
  });
  
  page.drawText(`Payment Type: ${data.paymentType}`, {
    x: margin,
    y: paymentStartY - lineHeight * 2,
    size: 12,
    font: helveticaFont,
  });
  
  // Draw a line
  page.drawLine({
    start: { x: margin, y: paymentStartY - lineHeight * 3.5 },
    end: { x: page.getWidth() - margin, y: paymentStartY - lineHeight * 3.5 },
    thickness: 1,
    color: rgb(0.7, 0.7, 0.7),
  });
  
  // Draw total
  page.drawText(`Total Amount:`, {
    x: margin,
    y: paymentStartY - lineHeight * 5,
    size: 14,
    font: helveticaBold,
  });
  
  page.drawText(`$${data.amount.toFixed(2)}`, {
    x: page.getWidth() - margin - 100,
    y: paymentStartY - lineHeight * 5,
    size: 16,
    font: helveticaBold,
  });
  
  // Draw footer
  page.drawText('Thank you for choosing LearnFlow!', {
    x: margin,
    y: margin + 50,
    size: 12,
    font: helveticaFont,
  });
  
  page.drawText('For questions about this receipt, please contact support@learnflow.com', {
    x: margin,
    y: margin + 30,
    size: 10,
    font: helveticaFont,
  });
  
  // Save PDF
  const pdfBytes = await pdfDoc.save();
  
  // Create receipts directory if it doesn't exist
  const publicDir = path.join(process.cwd(), 'public');
  const receiptsDir = path.join(publicDir, 'receipts');
  
  try {
    await fs.access(receiptsDir);
  } catch {
    await fs.mkdir(receiptsDir, { recursive: true });
  }
  
  // Generate unique filename
  const filename = `receipt-${uuidv4()}.pdf`;
  const filePath = path.join(receiptsDir, filename);
  
  // Write to file
  await fs.writeFile(filePath, pdfBytes);
  
  // Return the public URL
  return `/receipts/${filename}`;
}
