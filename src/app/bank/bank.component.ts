import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { SharedService } from '../service/shared.service';
import { BankService } from './bank.service';
import swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css']
})
export class BankComponent implements OnInit {

  banks: any = [];
  bank: any;
  permisions: any = [];
  existingPermision: any = [];
  temp_var: boolean;
  whichForm: any = 'viewBank';
  checkedPermision: any = [];
  allCheckedPermision: any = [];
  updatedPermision: any = [];
  public data;
  public filterQuery = '';
  public rowsOnPage = 10;
  public sortBy = 'email';
  public sortOrder = 'asc';
  bankForm: FormGroup;
  addBankForm: FormGroup;
  editRoleForm: FormGroup;
  viewUserModel: any;
  edit: boolean;
  pages: any;
  pageNum: any;
  firstPage: any;
  lastPage: any;
  pageNumber: any;
  indexPassed: number;
  isMainMerchant: any;
  merchantId: any;
  merchants: any = [];
  uniqueKey: any;

  constructor(
    private bankService: BankService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    this.whichForm = 'viewBank';
    this.temp_var = true;
    this.isMainMerchant = this.sharedService.getIsMainMerchant();
    this.merchantId = this.sharedService.getMerchantId();
    this.bankForm = this.formBuilder.group({
      'bankCode': new FormControl({ value: '', disabled: true }),
      'bankName': [''],
      'isBvnRequired': [''],
      'status': [''],
      'isDateOfBirthRequired': [''],
      'isEmailRequired': [''],
      'isVisibleToMerchantForPayment': [''],
      'logoUrl': [''],
    });

    this.addBankForm = this.formBuilder.group({
      'bankCode': new FormControl(),
      'bankName': ['', Validators.required],
      'isBvnRequired': [''],
      'status': [''],
      'isDateOfBirthRequired': [''],
      'isEmailRequired': [''],
      'logoUrl': ['', Validators.required],
      'canBeUsedForInternetBanking': [''],
    });
    this.getAllBanks();
    if (this.isMainMerchant === 1) {
      this.viewAllMerchant();
    }
  }
  viewMerchantBank(pageNum = 0, uniqueKey) {
    this.pageNum = pageNum;
    const pageSize = 10;
    if (this.pageNum > 1) {
      this.indexPassed = (pageSize * (this.pageNum - 1)) + 1;
    } else {
      this.indexPassed = pageNum;
    }
    this.bankService.viewAllBanks(uniqueKey, pageSize, pageNum).subscribe(response => {
      this.banks = response.data;
      this.pageNumber = this.banks.pageNumber;
      this.lastPage = this.banks.last;
      const returnedPageSize = this.banks.totalPages - 1;
      const pageNumberArray = [];
      let i = 1;
      for (i = 1; i <= returnedPageSize; i++) {
        pageNumberArray.push(i);
      }
      this.pages = pageNumberArray;
    });
  }
  viewAllMerchant() {
    this.spinner.show();
    this.bankService.viewAllMerchant().subscribe(response => {
      this.merchants = response.data.merchants.content;
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }
  getAllBanks(pageNum = 1) {
    this.pageNum = pageNum;
    const pageSize = 10;
    if (this.pageNum > 1) {
      this.indexPassed = (pageSize * (this.pageNum - 1)) + 1;
    } else {
      this.indexPassed = pageNum;
    }
    this.bankService.viewAllBanks(this.merchantId, pageSize, pageNum).subscribe(response => {
      this.banks = response.data;
      this.pageNumber = this.banks.pageNumber;
      this.lastPage = this.banks.last;
      const returnedPageSize = this.banks.totalPages - 1;
      const pageNumberArray = [];
      let i = 1;
      for (i = 1; i <= returnedPageSize; i++) {
        pageNumberArray.push(i);
      }
      this.pages = pageNumberArray;
    });
  }
  viewBank(bank) {
    this.whichForm = 'editBank';
    this.edit = true;
    this.viewUserModel = Object.assign({}, bank);
    this.bankForm.setValue({
      'bankCode': (this.viewUserModel.bankCode) ? this.viewUserModel.bankCode : '',
      'bankName': (this.viewUserModel.bankName) ? this.viewUserModel.bankName : '',
      // tslint:disable-next-line:max-line-length
      'status': (this.viewUserModel.status === 'ACTIVE') ? this.viewUserModel.status = true : this.viewUserModel.status = false,
      // tslint:disable-next-line:max-line-length
      'isVisibleToMerchantForPayment': (this.viewUserModel.isVisibleToMerchantForPayment === 'ACTIVE') ? this.viewUserModel.isVisibleToMerchantForPayment = true : this.viewUserModel.isVisibleToMerchantForPayment = false,
      // tslint:disable-next-line:max-line-length
      'isBvnRequired': (this.viewUserModel.isBvnRequired === '1') ? this.viewUserModel.isBvnRequired = true : this.viewUserModel.isBvnRequired = false,
      // tslint:disable-next-line:max-line-length
      'isDateOfBirthRequired': (this.viewUserModel.isDateOfBirthRequired === '1') ? this.viewUserModel.isDateOfBirthRequired = true : this.viewUserModel.isDateOfBirthRequired = false,
      // tslint:disable-next-line:max-line-length
      'isEmailRequired': (this.viewUserModel.isEmailRequired === '1') ? this.viewUserModel.isEmailRequired = true : this.viewUserModel.isEmailRequired = false,
      'logoUrl': (this.viewUserModel.logoUrl) ? this.viewUserModel.logoUrl : ''
    });
  }

  updateStatus(data) {
    const body = {
      'bankName': data.bankName,
      'isBvnRequired': data.isBvnRequired,
      'isDateOfBirthRequired': data.isDateOfBirthRequired,
      'isEmailRequired': data.isEmailRequired,
      'logoUrl': data.logoUrl,
      'status': (data.status === 'ACTIVE') ? 'INACTIVE' : 'ACTIVE',
      // 'isVisibleToMerchantForPayment': (data.isVisibleToMerchantForPayment === 'ACTIVE') ? 'INACTIVE' : 'ACTIVE',
    };
    this.bankService.updateBank(data.bankCode, body).subscribe(response => {
      if (response.body.status === 'SUCCESS') {
        this.getAllBanks();
        this.sharedService.swalAlertMessage('Bank Status Update', 'Bank status updated successfully', 'success');
      }
    });
  }
  addNewBank() {
    this.whichForm = 'addNewBank';
  }

  addBank() {
    if (this.addBankForm.invalid) {
      this.sharedService.swalAlertMessage('Add New Bank', 'All feild are required', 'info');
      return;
    }
    const requestBody = ({
      'bankName': this.addBankForm.value.bankName,
      'bankCode': this.addBankForm.value.bankCode,
      'isBvnRequired': (this.addBankForm.value.isBvnRequired === true) ? 1 : 0,
      'isDateOfBirthRequired': (this.addBankForm.value.isDateOfBirthRequired === true) ? 1 : 0,
      'isEmailRequired': (this.addBankForm.value.isEmailRequired === true) ? 1 : 0,
      'canBeUsedForInternetBanking': (this.addBankForm.value.canBeUsedForInternetBanking === true) ? 1 : 0,
      'logoUrl': this.addBankForm.value.logoUrl,
      'status': (this.addBankForm.value.status === true) ? 'ACTIVE' : 'INACTIVE',
    });
    this.bankService.addBank(requestBody).subscribe(response => {
      if (response.status === 'SUCCESS') {
        this.sharedService.swalAlertMessage('Add New Bank', 'Bank created successfully', 'success');
      }
    });
  }
  updateBank(bank) {
    if (this.bankForm.invalid) {
      this.sharedService.swalAlertMessage('Bank Update', 'All fields are  required to be filled', 'info');
      return;
    }
    const body = {
      'isBvnRequired': (this.bankForm.value.isBvnRequired === true) ? 1 : 0,
      'isDateOfBirthRequired': (this.bankForm.value.isDateOfBirthRequired === true) ? 1 : 0,
      'isEmailRequired': (this.bankForm.value.isEmailRequired === true) ? 1 : 0,
      'logoUrl': this.bankForm.value.logoUrl,
      'status': (this.bankForm.value.status === true) ? 'ACTIVE' : 'INACTIVE',
      // 'canBeUsedForInternetBanking': (this.addBankForm.value.canBeUsedForInternetBanking === true) ? 1 : 0,
      'isVisibleToMerchantForPayment': (this.bankForm.value.isVisibleToMerchantForPayment === true) ? 'ACTIVE' : 'INACTIVE',
    };
    this.bankService.updateBank(this.viewUserModel.bankCode, body).subscribe(response => {
      if (response.status === 200) {
        this.getAllBanks();
        swal({
          title: 'Bank Update',
          text: 'Bank successfully updated',
          type: 'info',
          confirmButtonText: 'Ok',
          customClass: 'sweet-alert',
          allowOutsideClick: false
        }).then(() => {
          this.whichForm = 'viewBank';
        });
      }
    }, error => {
      this.handleErrors(error.error);
    });
  }


  goBack() {
    this.whichForm = 'viewBank';
  }
  handleErrors(error) {
    let errorMessage;
    if (error.status === 'FAILED' && error.error === 'PROCESSING') {
      errorMessage = 'An error occured';
    } else if (error.status === 'FAILED') {
      errorMessage = error.message;
    }
    this.sharedService.swalAlertMessage('Error!', errorMessage, 'error');
  }

}
