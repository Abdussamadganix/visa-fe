import { Injectable, ElementRef } from '@angular/core';
import * as XLSX from 'xlsx';
import * as jsPDF from 'jspdf';
// import * as jsPDF from 'jspdf-autotable';
// import * as autoTable from 'jspdf-autotable';
// import 'jspdf-autotable';
// declare var jsPDF: any;
// declare var jsPDF: any;

@Injectable({
  providedIn: 'root'
})
export class FileExportService {

  constructor() { }

  public static toExportFileName(excelFileName: string): string {
    return `${excelFileName}_export_${new Date().getTime()}.xlsx`;
  }

  public static toExportFileNameCSV(excelFileName: string): string {
    return `${excelFileName}_export_${new Date().getTime()}.csv`;
  }

  public exportAsCSVFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, FileExportService.toExportFileNameCSV(excelFileName));
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, FileExportService.toExportFileName(excelFileName));
  }

  public exportAsPDF(tableContent: ElementRef, fileExportName: String) {
    const pdfDoc = new jsPDF('p', 'pt', 'ledger');

    const specialElementHandler = {
      '#editor': function (element, renderer) {
        return true;
      }
    };

    const margins = {
      top: 80,
      bottom: 10,
      left: 10,
      width: 622
    };

    const content = tableContent.nativeElement;

    // pdfDoc.fromHTML(content.innerHTML, 5, 5, {
    //   'width': 300,
    //   'elementHandlers': specialElementHandler
    // });

    const fileName = fileExportName + '_export_' + (new Date().getTime()) + '.pdf';

    pdfDoc.fromHTML(content, // HTML string or DOM elem ref.
      margins.left, // x coord
      margins.top, { // y coord
        'width': margins.width, // max width of content on PDF
        'elementHandlers': specialElementHandler
      },
      function (dispose) {
        // dispose: object with X, Y of the last line add to the PDF
        //          this allow the insertion of new lines after html
        pdfDoc.save(fileName);
      }, margins);

    // pdfDoc.save(fileName);
  }

  public exportDataAsPDFAuditTrail(columns: any, dataRec: any, fileExportName: String, fontSize: number) {
    const pdfDoc = new jsPDF('l', 'pt');
    const fileNameDoc = fileExportName + '_export (' + (new Date().getTime()) + ')';
    pdfDoc.autoTable(columns, dataRec, {
      theme: 'striped',
      tableWidth: 'auto',
      orientation: 'landscape',
      styles: {
        fontSize: fontSize,
        overflow: 'linebreak',
        columnWidth: 'wrap',
      },
      columnStyles: {
        sn: { fillColor: 255 },
        request: { columnWidth: 'auto'},
        requestTime: { columnWidth: 100 },
      },
      margin: { top: 50, left: 10, right: 10, bottom: 20 },
      addPageContent: function (data) {
        pdfDoc.text(fileNameDoc, 40, 30);
      }
    });
    pdfDoc.setProperties({
      title: 'Xpresspayments',
      subject: 'download',
      author: 'Xpresspayment Solutions Limited',
    });
    const fileName = fileExportName + '_export_' + (new Date().getTime()) + '.pdf';
    pdfDoc.save(fileName);
  }

  public exportDataAsPDF(columns: any, dataRec: any, fileExportName: String, fontSize: number) {
    const pdfDoc = new jsPDF('l', 'pt');
    const fileNameDoc = fileExportName + '_export (' + (new Date().getTime()) + ')';
    pdfDoc.autoTable(columns, dataRec, {
      theme: 'striped',
      tableWidth: 'auto',
      orientation: 'landscape',
      styles: {
        fontSize: fontSize,
        overflow: 'linebreak',
        columnWidth: 'wrap',
      },
      columnStyles: {
        sn: { fillColor: 255 },
        // request: { columnWidth: 'auto'}
        // requestTime: { columnWidth: 100 },
      },
      margin: { top: 50, left: 10, right: 10, bottom: 20 },
      addPageContent: function (data) {
        pdfDoc.text(fileNameDoc, 40, 30);
      }
    });
    pdfDoc.setProperties({
      title: 'Xpresspayments',
      subject: 'download',
      author: 'Xpresspayment Solutions Limited',
    });
    const fileName = fileExportName + '_export_' + (new Date().getTime()) + '.pdf';
    pdfDoc.save(fileName);
  }

  public exportDataAsPDFTransaction(columns: any, dataRec: any, fileExportName: String, fontSize: number) {
    const pdfDoc = new jsPDF('l', 'pt');
    const fileNameDoc = fileExportName + '_export (' + (new Date().getTime()) + ')';
    pdfDoc.autoTable(columns, dataRec, {
      theme: 'striped',
      tableWidth: 'auto',
      orientation: 'landscape',
      styles: {
        fontSize: fontSize,
        overflow: 'linebreak',
        columnWidth: 'wrap',
      },
      columnStyles: {
        sn: { fillColor: 255 },
        request: { columnWidth: 'auto'},
        expectedApprovalCount: { columnWidth: 40 },
        approvalCount: { columnWidth: 40 },
        beneficiaryCount: { columnWidth: 40 },
        narration: { columnWidth: 60 },
        bankName: { columnWidth: 50 },
        transactionId: { columnWidth: 50 },
        beneficiaryMaintained: { columnWidth: 50 },
        transactionRef: { columnWidth: 50 },
      },
      margin: { top: 50, left: 10, right: 10, bottom: 20 },
      addPageContent: function (data) {
        pdfDoc.text(fileNameDoc, 40, 30);
      }
    });
    pdfDoc.setProperties({
      title: 'Xpresspayments',
      subject: 'download',
      author: 'Xpresspayment Solutions Limited',
    });
    const fileName = fileExportName + '_export_' + (new Date().getTime()) + '.pdf';
    pdfDoc.save(fileName);
  }
}
