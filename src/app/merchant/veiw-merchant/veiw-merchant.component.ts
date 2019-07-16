import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MerchantService } from '../merchant.service';
import * as $ from 'jquery';
import { JscriptService } from 'src/app/service/jscript.service';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/service/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Constants } from '../../constants';
import { FileExportService } from 'src/app/service/file-export.service';
import { PagerService } from 'src/app/service/pager.service';
const ApiBaseUrl = Constants.API_ENDPOINT;

@Component({
  selector: 'app-veiw-merchant',
  templateUrl: './veiw-merchant.component.html',
  styleUrls: ['./veiw-merchant.component.css']
})
export class VeiwMerchantComponent implements OnInit, OnDestroy {
  readonly merchantAPi = ApiBaseUrl + '/merchants';
  merchants: any = [];
  temp_var: boolean;
  myTableWidget: any;
  whichForm: string;
  viewMerchantModel: any;
  editMerchantAdminForm: FormGroup;
  isLoading: boolean;
  statusChange: boolean;
  cardPayment: boolean;
  qrPayment: boolean;
  ussdPayment: boolean;
  walletPayment: boolean;
  accountPayment: boolean;
  pages: any;
  pageNum: any;
  firstPage: any;
  lastPage: any;
  pageNumber: any;
  indexPassed: number;
  banks: any = [];
  charges = [];
  type: any = [];
  counter: any;
  chargeList: any;
  viewMerchant: any;
  merchantUnique: any;
  API_URL: '';
  pageSize: any;
  nofileUpload: string;
  fileAvailable: boolean;
  src: any;
  totalElements: any;
  viewDownloadButton: boolean;
  @ViewChild('downloadZipLink') private downloadZipLink: ElementRef;
  @ViewChild('startDate') private startDate: ElementRef;
  @ViewChild('endDate') private endDate: ElementRef;
  constructor(private merchantService: MerchantService, private router: Router,
    private jscript: JscriptService, private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private spinner: NgxSpinnerService,
    private fileExportService: FileExportService,
    private pagerService: PagerService,
  ) { }

  // array of all items to be paged
  private allItems: any[];
  // pager object
  pager: any = {};
  // paged items
  pagedItems: any[];

  ngOnInit() {
    this.viewDownloadButton = false;
    this.src = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
    const load8 = './assets/custom/js/custom.js';
    this.jscript.load(load8).then(e => true)
      .catch(e => false);
    this.fileAvailable = false;
    this.nofileUpload = '';
    this.viewAllMerchant();
    this.getBanks();
    this.whichForm = 'viewMerchant';
    this.counter = 0;
    this.editMerchantAdminForm = this.formBuilder.group({
      'email': new FormControl({ value: '', disabled: true }),
      'name': new FormControl({ value: '', disabled: true }),
      'settlementAccountNumber': [''],
      'bankCode': [''],
      'businessType': ['', Validators.required],
      'merchantType': ['', Validators.required],
      'status': ['', Validators.required],
      'cardPayment': ['', Validators.required],
      'accountPayment': ['', Validators.required],
      'walletPayment': ['', Validators.required],
      'qrPayment': ['', Validators.required],
      'ussdPayment': ['', Validators.required],
      'authMode': [''],
      'transactionLimit': ['', Validators.required],
      'businessNumber': ['', Validators.required],
      'isMerchantBearer': ['', Validators.required],
      'charges': this.formBuilder.array([
        this.initCharges(),
      ])
    });
  }

  // downloadFile(merchant) {
  // }

  public async downloadFile(merchant): Promise<void> {
    let fileExtension;
    const file = this.viewMerchantModel.file;
    if (file !== null || file !== undefined) {
      const fileName = file.split('\\').pop();
      fileExtension = fileName.split('.').pop();
    }
    const blob = await this.merchantService.downloadFile(merchant);
    const url = window.URL.createObjectURL(blob);
    const link = this.downloadZipLink.nativeElement;
    link.href = url;
    link.download = makeid(9) + '-' + this.viewMerchantModel.name + '.' + fileExtension;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  newSearch(pageNum = 1, paginate = '') {
    let queryPAram;
    let paging;
    if (paginate === 'paginate') {
      const x = pageNum - 1;
      const y = +x;
      paging = '&pageNumber=' + y + '&pageSize=10';
    }
    // tslint:disable-next-line:max-line-length
    queryPAram = this.getQueryParams(this.startDate.nativeElement.value + ' 00:00:00', this.endDate.nativeElement.value + ' 23:59:59', 'false');
    this.merchantService.searchMerchant(queryPAram, paging).subscribe(response => {
      this.merchants = response.data.merchants;
      this.totalElements = response.data.merchants.totalElements;
      this.pager = this.pagerService.getPager(this.totalElements, pageNum);
    });

  }

  downloadReportExcel() {
    if (this.pageSize === undefined || this.pageSize === null || this.pageSize === '') {
      this.pageSize = 10;
    }
    let queryPAram;
    const pageNum = 0;
    const paging = '&pageNumber=0' + '&pageSize=' + this.totalElements;
    // tslint:disable-next-line:max-line-length
    queryPAram = this.getQueryParams(this.startDate.nativeElement.value + ' 00:00:00', this.endDate.nativeElement.value + ' 23:59:59', 'false');
    this.merchantService.downloadMerchants(queryPAram, paging).subscribe(response => {
      const merchants = response.data.merchants.content;
      this.fileExportService.exportAsExcelFile(merchants, 'merchant_report');
    });
  }
  getQueryParams(fromCreatedAt, toCreatedAt, all) {
    this.merchants = [];
    let queryPAram = '';
    if (this.startDate.nativeElement.value !== '') {
      queryPAram = '?' + queryPAram + 'fromCreatedAt=' + this.toTimestamp(fromCreatedAt);
    }
    if (this.endDate.nativeElement.value !== '') {
      let concat = '';
      if (queryPAram === '') {
        concat = '?';
      } else {
        concat = '&';
      }
      queryPAram = queryPAram + concat + 'toCreatedAt=' + this.toTimestamp(toCreatedAt);
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

  toTimestamp(date) {
    const datum = Date.parse(date);
    return datum;
  }
  viewAllMerchant(pageNum = 0) {
    const pageSize = 10;
    this.spinner.show();
    this.merchantService.viewAllMerchant(pageSize, pageNum).subscribe(response => {
      this.viewDownloadButton = true;
      this.spinner.hide();
      this.merchants = response.data.merchants;
      // console.log( this.merchants);
      this.totalElements = response.data.merchants.totalElements;
      this.pager = this.pagerService.getPager(this.totalElements);
    }, error => this.spinner.hide());
  }

  onCheckboxChange() {
    // if (this.statusChange) {
    //   setTimeout(() => {
    //     this.statusChange = false;
    //   });
    // } else {
    //   this.statusChange = true;
    // }
  }

  updateMerchant(merchant) {
    this.whichForm = 'updateMerchant';
  }

  goBack() {
    this.whichForm = 'viewMerchant';
    this.viewAllMerchant();
  }

  initCharges() {
    return this.formBuilder.group({
      name: [''],
      uniqueKey: [''],
      chargeType: [''],
      value: ['']
    });
  }

  addCharges() {
    const control = <FormArray>this.editMerchantAdminForm.controls['charges'];
    control.push(this.initCharges());
  }

  removeCharges(i: number) {
    const r = confirm('Are you sure you want to remove this charge');
    if (r !== true) {
      return;
    }
    const control = <FormArray>this.editMerchantAdminForm.controls['charges'];
    control.removeAt(i);
    const a = this.charges.forEach((element, index) => {
      if (i === index) {
        const requestBody = {
          'charges': [{
            'name': element.name,
            'uniqueKey': element.uniqueKey,
            'chargeType': element.chargeType,
            'value': element.value,
            'status': 'INACTIVE'
          }
          ]
        };
        this.spinner.show();
        this.merchantService.updateMerchant(this.viewMerchantModel.uniqueKey, requestBody)
          .subscribe(data => {
            this.spinner.hide();
            this.sharedService.swalAlertMessage('Update Merchant', 'Merchant Updated Successfully', 'info');
            this.whichForm = 'viewMerchant';
          },
            error => {
              this.handleErrors(error.error);
            });
      }
    });
  }

  getBanks() {
    this.merchantService.viewAllBanks().subscribe(response => {
      this.banks = response.data.banks;
    });
  }

  buttonAdd() {
    this.counter++;
    // tslint:disable-next-line:max-line-length
    $('#feeForm').append('<div id="fee' + this.counter + '"><div class="row"><div class="col-md-3"><div class="form-group"><label class="control-label">Name:</label><input type="text" class="form-control" required="required" id="name" class="form-control" placeholder="Enter Charge Name" [(ngModel)]="name1" name="name1[]"></div></div><div class="col-md-3"><div class="form-group"><label class="control-label">Type:</label><select required="required" class="form-control" name="type1[]"><option value="FIXED">Fixed</option><option value="PERCENTAGE">Percentage</option></select></div></div><div class="col-md-3"><div class="form-group"><label class="control-label">Value:</label><input type="text" class="form-control" required="required" class="form-control" placeholder="" [(ngModel)]="value1" name="value1[]"></div></div><div class="col-md-3 "><div class="form-group"><button type="button" class="btn btn-danger" onclick="buttonMinus(\'' + 'fee' + this.counter + '\')" style="margin-top:30px"><i class="fa fa-times" ></i> Remove Charge</button></div></div></div></div>');
  }

  buttonMinus(divId) {
    $('#' + divId + '').remove();
  }
  updateMerchants(merchant) {
    // console.log(merchant);
    if (this.editMerchantAdminForm.invalid) {
      this.sharedService.swalAlertMessage('Update Merchant', 'All feild are required', 'info');
      return;
    }
    const requestBody = {
      email: this.viewMerchantModel.email,
      businessType: this.editMerchantAdminForm.value.businessType,
      merchantType: this.editMerchantAdminForm.value.merchantType,
      settlementAccountNumber: this.editMerchantAdminForm.value.settlementAccountNumber,
      name: this.editMerchantAdminForm.value.name,
      charges: this.editMerchantAdminForm.value.charges,
      businessNumber: this.editMerchantAdminForm.value.businessNumber,
      isMerchantBearer: this.editMerchantAdminForm.value.isMerchantBearer,
      transactionLimit: this.editMerchantAdminForm.value.transactionLimit,
      status: (this.editMerchantAdminForm.value.status === true) ? STATUS.ACTIVE : STATUS.INACTIVE,
      ussdPayment: (this.editMerchantAdminForm.value.ussdPayment === true) ? STATUS.ACTIVE : STATUS.INACTIVE,
      walletPayment: (this.editMerchantAdminForm.value.walletPayment === true) ? STATUS.ACTIVE : STATUS.INACTIVE,
      qrPayment: (this.editMerchantAdminForm.value.qrPayment === true) ? STATUS.ACTIVE : STATUS.INACTIVE,
      cardPayment: (this.editMerchantAdminForm.value.cardPayment === true) ? STATUS.ACTIVE : STATUS.INACTIVE,
      bankCode: this.editMerchantAdminForm.value.bankCode
    };
    this.spinner.show();
    this.merchantService.updateMerchant(this.viewMerchantModel.uniqueKey, requestBody)
      .subscribe(data => {
        this.spinner.hide();
        this.sharedService.swalAlertMessage('Update Merchant', 'Merchant Updated Successfully', 'info');
        this.whichForm = 'viewMerchant';
      },
        error => {
          this.handleErrors(error.error);
        });
  }

  editMerchantForm(merchant) {
    this.viewMerchantModel = Object.assign({}, merchant);
    this.viewMerchant = this.merchantService.viewSingleMerchant(this.viewMerchantModel.uniqueKey).subscribe(response => {
      this.charges = response.data.charges;
      this.editMerchantAdminForm.setControl('charges', this.setCharges(this.charges));
    });
    // tslint:disable-next-line:max-line-length
    if (this.viewMerchantModel.fileName !== '' && this.viewMerchantModel.fileName !== null && this.viewMerchantModel.fileName !== undefined) {
      this.fileAvailable = true;
      this.viewMerchant = this.merchantService.viewMerchantFile(this.viewMerchantModel.uniqueKey).subscribe(response => {
      });
    } else {
      this.nofileUpload = 'Merchant yet to upload file';
    }
    (this.viewMerchantModel.status === STATUS.ACTIVE) ? this.statusChange = true : this.statusChange = false;
    (this.viewMerchantModel.cardPayment === STATUS.ACTIVE) ? this.cardPayment = true : this.cardPayment = false;
    (this.viewMerchantModel.qrPayment === STATUS.ACTIVE) ? this.qrPayment = true : this.qrPayment = false;
    (this.viewMerchantModel.ussdPayment === STATUS.ACTIVE) ? this.ussdPayment = true : this.ussdPayment = false;
    (this.viewMerchantModel.walletPayment === STATUS.ACTIVE) ? this.walletPayment = true : this.walletPayment = false;
    (this.viewMerchantModel.accountPayment === STATUS.ACTIVE) ? this.accountPayment = true : this.accountPayment = false;
    this.whichForm = 'updateMerchant';
    this.editMerchantAdminForm.patchValue({
      'email': merchant.email,
      'name': merchant.name,
      'settlementAccountNumber': merchant.settlementAccountNumber,
      'bankCode': merchant.bankCode,
      'businessType': merchant.businessType,
      'merchantType': merchant.merchantType,
      'status': merchant.status,
      'cardPayment': merchant.cardPayment,
      'accountPayment': merchant.accountPayment,
      'qrPayment': merchant.qrPayment,
      'walletPayment': merchant.walletPayment,
      'ussdPayment': merchant.ussdPayment,
      'authMode': merchant.authMode ? merchant.authMode : '',
      'transactionLimit': merchant.transactionLimit ? merchant.transactionLimit : '',
      'businessNumber': merchant.businessNumber ? merchant.businessNumber : '',
      'isMerchantBearer': merchant.isMerchantBearer ? merchant.isMerchantBearer : '',
    });
    this.merchantUnique = merchant.uniqueKey;
  }

  ngOnDestroy(): void {
  }

  setCharges(charges): FormArray {
    const formArray = new FormArray([]);
    charges.forEach(element => {
      formArray.push(this.formBuilder.group({
        'name': element.name,
        'uniqueKey': element.uniqueKey,
        'chargeType': element.chargeType,
        'value': element.value
      }));
    });
    return formArray;
  }

  handleErrors(error) {
    this.spinner.hide();
    let errorMessage;
    if (error.status === 'FAILED' && error.error === 'PROCESSING') {
      errorMessage = 'An error occured';
    } else if (error.status === 'FAILED') {
      errorMessage = error.message;
    }
    this.sharedService.swalAlertMessage('Error!', errorMessage, 'error');
  }
}

enum STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

function makeid(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}



