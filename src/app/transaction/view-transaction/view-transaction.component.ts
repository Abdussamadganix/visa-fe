import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { TransactionService } from '../transaction.service';
import * as $ from 'jquery';
import { Subject, from } from 'rxjs';
import { SharedService } from '../../service/shared.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { PagerService } from 'src/app/service/pager.service';
import { FileExportService } from 'src/app/service/file-export.service';
@Component({
  selector: 'app-view-transaction',
  templateUrl: './view-transaction.component.html',
  styleUrls: ['./view-transaction.component.css']
})
export class ViewTransactionComponent implements OnInit, OnDestroy {
  temp_var: boolean;
  transactions: any;
  whichForm: String;
  transaction: any;
  userForm: FormGroup;
  searchForm: FormGroup;
  myTableWidget: any;
  edit: boolean;
  pages: any;
  pageNum: any;
  firstPage: any;
  lastPage: any;
  pageNumber: any;
  indexPassed: number;
  merchants: any = [];
  uniqueKey: any;
  isMainMerchant: any;
  totalElements: any;
  // array of all items to be paged
  private allItems: any[];
  isSearched: any;
  viewDownloadButton: boolean;
  // pager object
  pager: any = {};
  pageSize: any;
  allTrans: boolean;
  // paged items
  pagedItems: any[];
  @ViewChild('merchantKey') private merchantKey: ElementRef;
  @ViewChild('startDate') private startDate: ElementRef;
  @ViewChild('endDate') private endDate: ElementRef;
  @ViewChild('transactionId') private transactionId: ElementRef;
  @ViewChild('all') private all: ElementRef;

  constructor(private transactionService: TransactionService,
    private router: Router,
    private sharedService: SharedService,
    private spinner: NgxSpinnerService,
    private pagerService: PagerService,
    private fb: FormBuilder,
    private fileExportService: FileExportService) { }

  ngOnInit() {
    this.allTrans = false;
    this.viewDownloadButton = false;
    this.whichForm = 'viewTransaction';
    this.isMainMerchant = this.sharedService.getIsMainMerchant();
    this.viewTransactions();
    if (this.isMainMerchant === 1) {
      this.viewAllMerchant();
    }
    this.searchForm = this.fb.group({
      'fromCreatedAt': [''],
      'toCreatedAt': [''],
      'reference': ['']
    });
  }

  downloadReportExcel() {
    // const from1 = '';
    // const to = '';
    const merchant = this.uniqueKey;
    if (merchant === '') {
      this.sharedService.swalAlertMessage('Downlaod transaction!', 'Please select a merchant', 'info');
      return;
    }
    let pageSize;
    pageSize = this.totalElements;
    let newQueryPAram;
    this.spinner.show();
    // tslint:disable-next-line:max-line-length
    newQueryPAram = this.getQueryParams(this.startDate.nativeElement.value + ' 00:00:00', this.endDate.nativeElement.value + ' 23:59:59', this.transactionId.nativeElement.value, 'true');
    const user = JSON.parse(localStorage.getItem('xpdackuser'));
    const paging = '&pageNumber=0' + '&pageSize=' + pageSize;
    const uniqueKey = user.user.merchantId;
    this.transactionService.downloadTransactions(uniqueKey, newQueryPAram, paging).subscribe(response => {
      this.spinner.hide();
      this.transactions = response.data.payments.content;
      this.fileExportService.exportAsExcelFile(this.transactions, 'transaction_report');
      // this.setPage(this.totalElements, 1, this.isSearched);
    }, error => this.spinner.hide());
    // this.spinner.show();
    // this.transactionService.getTransactions(merchant, 0, this.totalElements, from1, to, this.allTrans).subscribe(response => {
    //   const trans = response.data.payments.content;
    //   this.spinner.hide();
    // }, error => this.spinner.hide());
  }

  allTransaction(event) {
    if (event.target.checked === true) {
      this.allTrans = true;
    } else {
      this.allTrans = false;
    }
  }


  newSearchTransaction(pageNum = 1, paginate = '') {
    let newQueryPAram;
    this.transactions = [];
    const userData = JSON.parse(localStorage.getItem('xpdackuser'));
    let merchant;
    if (this.merchantKey.nativeElement.value) {
      merchant = this.merchantKey.nativeElement.value;
    } else {
      merchant = userData.user.merchantId;
    }
    let paging;
    if (paginate === 'paginate') {
      const x = pageNum - 1;
      const y = +x;
      paging = '&pageNumber=' + y + '&pageSize=10';
    }
    if (this.allTrans === true) {
      this.spinner.show();
      // tslint:disable-next-line:max-line-length
      newQueryPAram = this.getQueryParams(this.startDate.nativeElement.value + ' 00:00:00', this.endDate.nativeElement.value + ' 23:59:59', this.transactionId.nativeElement.value, 'true');
      const user = JSON.parse(localStorage.getItem('xpdackuser'));
      const uniqueKey = user.user.merchantId;
      this.transactionService.searchTransactions(uniqueKey, newQueryPAram, paging).subscribe(response => {
    this.viewDownloadButton = true;
        this.spinner.hide();
        this.transactions = response.data.payments.content;
        this.totalElements = response.data.payments.totalElements;
        this.pager = this.pagerService.getPager(this.totalElements, pageNum);
        // this.setPage(this.totalElements, 1, this.isSearched);
      }, error => this.spinner.hide());
      return;
    }
    // tslint:disable-next-line:max-line-length
    newQueryPAram = this.getQueryParams(this.startDate.nativeElement.value + ' 00:00:00', this.endDate.nativeElement.value + ' 23:59:59', this.transactionId.nativeElement.value, 'false');
    const reference = this.searchForm.value.reference;
    this.spinner.show();
    this.transactionService.searchTransactions(merchant, newQueryPAram, paging).subscribe(response => {
      this.transactions = response.data.payments.content;
      this.totalElements = response.data.payments.totalElements;
      this.pager = this.pagerService.getPager(this.totalElements, pageNum);
      // this.pageSize = response.data.payments.totalElements;
      this.isSearched = 'isSearched';
      // this.setPage(this.totalElements, 1, this.isSearched);
      this.spinner.hide();
    }, error => this.spinner.hide());
  }
  toTimestamp(date) {
    const datum = Date.parse(date);
    return datum;
  }

  timestampFrom(date) {
    const splitDate = date.split('-');
    const year = splitDate['0'];
    const month = splitDate['1'];
    const day = splitDate['2'];
    // const a = new Date(year, month, day, hours, minutes, seconds, milliseconds);
    const fullDate: any = new Date(year, month, day, 0, 0, 0, 0);
    const timeStamp = Date.parse(fullDate);
    return timeStamp;
  }

  getQueryParams(fromCreatedAt, toCreatedAt, transactionId, all) {
    let queryPAram = '';
    if (fromCreatedAt !== '') {
      queryPAram = '?' + queryPAram + 'fromCreatedAt=' + this.toTimestamp(fromCreatedAt);
    }
    if (toCreatedAt !== '') {
      let concat = '';
      if (queryPAram === '') {
        concat = '?';
      } else {
        concat = '&';
      }
      queryPAram = queryPAram + concat + 'toCreatedAt=' + this.toTimestamp(toCreatedAt);
    }
    if (transactionId !== '') {
      let concat = '';
      if (queryPAram === '') {
        concat = '?';
      } else {
        concat = '&';
      }
      queryPAram = queryPAram + concat + 'transactionId=' + transactionId;
    }
    if (all !== '') {
      let concat = '';
      if (queryPAram === '') {
        concat = '?';
      } else {
        concat = '&';
      }
      queryPAram = queryPAram + concat + 'all=' + all;
    }
    return queryPAram;
  }

  resetForm() {
    $('#merchantKey').val('');
    $('#endDate').val('');
    $('#startDate').val('');
    $('#transactionId').val('');
  }

  viewAllMerchant() {
    this.spinner.show();
    this.transactionService.viewAllMerchant(0, 2000).subscribe(response => {
      this.merchants = response.data.merchants.content;
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }


  viewMerchantTransactions(pageNum = 0, uniqueKey) {
    const from1 = '';
    const to = '';
    const pageSize = 10;
    this.spinner.show();
    this.transactionService.getTransactions(this.uniqueKey, pageSize, pageNum, from1, to).subscribe(response => {
      this.spinner.hide();
      this.transactions = response.data.payments.content;
      // this.transactions = response.data.payments.content;
      this.totalElements = response.data.payments.totalElements;
      this.setPage(this.totalElements, 1);

    }, error => {
      this.spinner.hide();
    });
  }

  viewTransactions(pageNum = 0) {
    const from1 = '';
    const to = '';
    const pageSize = 10;
    const user = JSON.parse(localStorage.getItem('xpdackuser'));
    this.uniqueKey = user.user.merchantId;
    this.spinner.show();
    this.transactionService.getTransactions(this.uniqueKey, pageNum, pageSize, from1, to).subscribe(response => {
      this.spinner.hide();
      this.totalElements = response.data.payments.totalElements;
      this.transactions = response.data.payments.content;
      this.pager = this.pagerService.getPager(this.totalElements);
      this.temp_var = true;
    }, error => {
      this.spinner.hide();
    });
  }

  setPage(totalPage: number, pageNum: number, isSearched = '') {
    const pageSize = 10;
    let merchant;
    let newQueryPAram;
    if (isSearched === 'isSearched') {
      // tslint:disable-next-line:max-line-length
      newQueryPAram = this.getQueryParams(this.startDate.nativeElement.value, this.endDate.nativeElement.value, this.transactionId.nativeElement.value, 'true');
      merchant = (this.merchantKey.nativeElement.value !== '') ? this.merchantKey.nativeElement.value : this.uniqueKey;
      this.spinner.show();
      this.totalElements = '';
      this.transactionService.searchTransactions1(merchant, newQueryPAram, pageNum - 1, pageSize).subscribe(response => {
        this.transactions = response.data.payments.content;
        this.totalElements = response.data.payments.totalElements;
        this.pager = this.pagerService.getPager(totalPage, pageNum);
        this.spinner.hide();
      }, error => this.spinner.hide());
      return;
    }
    merchant = (this.merchantKey.nativeElement.value !== '') ? this.merchantKey.nativeElement.value : this.uniqueKey;
    this.transactionService.getTransactions(merchant, pageNum - 1, pageSize).subscribe(response => {
      this.pager = this.pagerService.getPager(totalPage, pageNum);
      this.transactions = response.data.payments.content;
      this.totalElements = response.data.payments.totalElements;
    }, error => { this.spinner.hide(); });
  }


  viewTransaction(merchantKey, transactionKey) {
    this.spinner.show();
    this.transactionService.getTransaction(merchantKey, transactionKey)
      .subscribe(
        res => {
          this.spinner.hide();
          this.transaction = res.data.payment;
        }, error => this.spinner.hide());
  }

  viewTransactionDetails(transaction) {
    this.whichForm = 'viewSingleTransactionDetails';
    this.edit = false;
    this.transaction = Object.assign({}, transaction);
  }
  goBack() {
    this.whichForm = 'viewTransaction';
  }

  ngOnDestroy(): void {
  }
}
