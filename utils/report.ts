import fs from 'fs'
import PdfPrinter from 'pdfmake'
import { TDocumentDefinitions } from 'pdfmake/interfaces'

const fonts = {
  Courier: {
    normal: 'Courier',
    bold: 'Courier-Bold',
    italics: 'Courier-Oblique',
    bolditalics: 'Courier-BoldOblique',
  },
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique',
  },
}

const printer = new PdfPrinter(fonts)

export async function createPdfReport(doc: TDocumentDefinitions) {
  return new Promise((resolve) => {
    const pdfDoc = printer.createPdfKitDocument(doc)
    const stream = fs.createWriteStream('document.pdf')
    pdfDoc.pipe(stream)
    pdfDoc.end()
    stream.on('finish', resolve)
  })
}
