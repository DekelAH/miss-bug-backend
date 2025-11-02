import PDFDocument from 'pdfkit'
import { readJsonFile } from './util.service.js'

const bugs = readJsonFile('./data/bugs.json')

export const pdfService = {

    buildPDF
}

export function buildPDF(dataCallback, endCallback) {

    const doc = new PDFDocument()
    doc.on('data', dataCallback)
    doc.on('end', endCallback)
    doc.fontSize(18).text('Bugs Report')
    doc.moveDown()
    doc.fontSize(12).text(JSON.stringify(bugs, null, 2))
    doc.end()
}