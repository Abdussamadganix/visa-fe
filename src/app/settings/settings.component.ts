import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SettingsService } from './settings.service';
import { SharedService } from '../service/shared.service';
import { MerchantService } from '../merchant/merchant.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { BankService } from '../bank/bank.service';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';
import { CustomValidator } from '../validation/CustomValidator ';
import { MustMatch } from '../validation/must-match.validator';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  usersInfo: any;
  personalInfoForm: FormGroup;
  businessInfoForm: FormGroup;
  bankAccountForm: FormGroup;
  uniqueKey: string;
  merchantId: string;
  num: number;
  dataSource: any = [];
  merchantKeyInfoForm: FormGroup;
  paymentSetupForm: FormGroup;
  banks: any;
  viewMerchantModel: any;
  merchantBusinessInfo: any;
  whichForm: any;
  temp_var: any;
  isMainMerchant: any;
  // banks: any = [];
  bank: any;
  permisions: any = [];
  existingPermision: any = [];
  // temp_var: boolean;
  // whichForm: any = 'viewBank';
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
  changePasswordForm: FormGroup;
  viewUserModel: any;
  edit: boolean;
  pages: any;
  pageNum: any;
  firstPage: any;
  lastPage: any;
  pageNumber: any;
  indexPassed: number;
  allBanks: any = [];
  merchants: any = [];
  submitted: boolean;
  constructor(private fb: FormBuilder,
    private settingService: SettingsService,
    private sharedService: SharedService,
    private merchantService: MerchantService,
    public toastr: ToastrManager,
    private bankService: BankService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder) {
    this.personalInfoForm = this.fb.group({
      'firstName': [''],
      'lastName': [''],
      'email': [''],
      'address': [''],
      'phone': ['']
    });
    this.businessInfoForm = this.fb.group({
      'businessName': [''],
      'businessPhoneNumber': [''],
      'businessEmail': [''],
      'businessAddress': [''],
      'businessNumber': ['']
    });
    this.bankAccountForm = this.fb.group({
      'settlementAccountName': [''],
      'settlementAccountNumber': [''],
      'bankCode': ['']
    });
    this.paymentSetupForm = this.fb.group({
      'accountPayment': [''],
      'qrPayment': [''],
      'ussdPayment': [''],
      'walletPayment': [''],
      'cardPayment': [''],
    });
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
    this.merchantKeyInfoForm = this.fb.group({
      'privateKey': new FormControl(),
      'publicKey': new FormControl(),
    });

    this.changePasswordForm = this.fb.group({
      'currentPassword': ['', Validators.required],
      'password': ['', [Validators.required, CustomValidator.passwordValidator]],
      'confirmPassword': ['', Validators.required]
    }, {
        validator: MustMatch('password', 'confirmPassword')
    });
  }

  ngOnInit() {
    this.num = 0;
    this.whichForm = 'viewBank';
    this.temp_var = true;
    this.uniqueKey = this.sharedService.getUserUniqueId();
    this.merchantId = this.sharedService.getMerchantId();
    this.isMainMerchant = this.sharedService.getIsMainMerchant();
    this.merchantId = this.sharedService.getMerchantId();
    this.getUser();
    this.getMerchant();
    this.getBanks();
  }
  onAddData() {
    this.dataSource.push(this.dataSource.length);
  }

  showCopied() {
    this.toastr.successToastr('Copied Successfully.', 'Success!');
  }

  copyContent(event) {
    this.showCopied();
  }
  getUser() {
    this.settingService.getUser(this.uniqueKey).subscribe(response => {
      this.usersInfo = response.data.user;
      this.personalInfoForm.setValue({
        'firstName': this.usersInfo.firstName,
        'lastName': this.usersInfo.lastName,
        'email': this.usersInfo.email,
        'phone': this.usersInfo.phone,
        'address': this.usersInfo.address
      });
    });
  }
  getMerchant() {
    this.settingService.getMerchant(this.merchantId, 0, 2000).subscribe(response => {
      const merchantKeyInfo = response.data.credentials;
      this.merchantBusinessInfo = response.data.merchant;
      this.merchantKeyInfoForm.setValue({
        'privateKey': merchantKeyInfo.privateKey,
        'publicKey': merchantKeyInfo.publicKey,
      });
      this.businessInfoForm.setValue({
        'businessName': this.merchantBusinessInfo.name,
        'businessPhoneNumber': (this.merchantBusinessInfo.businessPhoneNumber) ? this.merchantBusinessInfo.businessPhoneNumber : '',
        'businessEmail': this.merchantBusinessInfo.email,
        'businessAddress': this.merchantBusinessInfo.businessAddress,
        'businessNumber': this.merchantBusinessInfo.businessNumber,
      });
      this.paymentSetupForm.setValue({
        'accountPayment': (this.merchantBusinessInfo.accountPayment === 'ACTIVE') ? true : false,
        'qrPayment': (this.merchantBusinessInfo.qrPayment === 'ACTIVE') ? true : false,
        'ussdPayment': (this.merchantBusinessInfo.ussdPayment === 'ACTIVE') ? true : false,
        'walletPayment': (this.merchantBusinessInfo.walletPayment === 'ACTIVE') ? true : false,
        'cardPayment': (this.merchantBusinessInfo.cardPayment === 'ACTIVE') ? true : false,
      });
    });
  }

  updateAccount() {
    const requestBody = {
      'accountPayment': this.merchantBusinessInfo.accountPayment === 'INACTIVE' ? 'ACTIVE' : 'INACTIVE',
    };
    this.settingService.updateMerchant(this.merchantId, requestBody).subscribe(response => {
      if (response.body.status === 'SUCCESS') {
        this.sharedService.swalAlertMessage('Payment Setup', 'Updated successfuly', 'success');
        this.getMerchant();
      } else {
        this.sharedService.swalAlertMessage('Payment Setup', 'Not updated successfuly', 'error');
      }
    }, error => {
      this.handleErrors(error.error);
    });
  }
  updateQr(event) {
    const requestBody = {
      'qrPayment': this.merchantBusinessInfo.qrPayment === 'INACTIVE' ? 'ACTIVE' : 'INACTIVE',
    };
    this.settingService.updateMerchant(this.merchantId, requestBody).subscribe(response => {
      if (response.body.status === 'SUCCESS') {
        this.sharedService.swalAlertMessage('Payment Setup', 'Updated successfuly', 'success');
        this.getMerchant();
      } else {
        this.sharedService.swalAlertMessage('Payment Setup', 'Not updated successfuly', 'error');
      }
    }, error => {
      this.handleErrors(error.error);
    });
  }

  updateUssd() {
    const requestBody = {
      'ussdPayment': this.merchantBusinessInfo.ussdPayment === 'INACTIVE' ? 'ACTIVE' : 'INACTIVE',
    };
    this.settingService.updateMerchant(this.merchantId, requestBody).subscribe(response => {
      if (response.body.status === 'SUCCESS') {
        this.sharedService.swalAlertMessage('Payment Setup', 'Updated successfuly', 'success');
        this.getMerchant();
      } else {
        this.sharedService.swalAlertMessage('Payment Setup', 'Not updated successfuly', 'error');
      }
    }, error => {
      this.handleErrors(error.error);
    });
  }
  updatecard() {
    const requestBody = {
      'cardPayment': this.merchantBusinessInfo.cardPayment === 'INACTIVE' ? 'ACTIVE' : 'INACTIVE',
    };
    this.settingService.updateMerchant(this.merchantId, requestBody).subscribe(response => {
      if (response.body.status === 'SUCCESS') {
        this.sharedService.swalAlertMessage('Payment Setup', 'Updated successfuly', 'success');
        this.getMerchant();
      } else {
        this.sharedService.swalAlertMessage('Payment Setup', 'Not updated successfuly', 'error');
      }
    }, error => {
      this.handleErrors(error.error);
    });
  }

  updateWallet() {
    const requestBody = {
      'walletPayment': this.merchantBusinessInfo.walletPayment === 'INACTIVE' ? 'ACTIVE' : 'INACTIVE',
    };
    this.settingService.updateMerchant(this.merchantId, requestBody).subscribe(response => {
      if (response.body.status === 'SUCCESS') {
        this.sharedService.swalAlertMessage('Payment Setup', 'Updated successfuly', 'success');
        this.getMerchant();
      } else {
        this.sharedService.swalAlertMessage('Payment Setup', 'Not updated successfuly', 'error');
      }
    }, error => {
      this.handleErrors(error.error);
    });
  }

  changePassword(form) {
    this.submitted = true;
    if (!this.changePasswordForm.valid) {
      return;
    }

    const requestBody = {
      'password': this.changePasswordForm.value.password,
    };
    this.settingService.changePassword(requestBody).subscribe(response => {
      this.changePasswordForm.reset();
      this.submitted = false;
      if (response.status === 'SUCCESS') {
        this.sharedService.swalAlertMessage('Change Password', 'Updated successfuly', 'success');
        this.getMerchant();
      } else {
        this.sharedService.swalAlertMessage('Change Password', 'Not updated successfuly', 'error');
      }
    }, error => {
      this.handleErrors(error.error);
    });
  }

  get password() {
    return this.changePasswordForm.get('password');
  }

  get f () {
    // return this.changePasswordForm.get('');
    return this.changePasswordForm.controls;
  }

  onPasswordStrengthChanged(strength) {
    // console.log(strength);
    // console.log('====================================');
    // console.log('onPasswordStrengthChanged', strength);
    // console.log('====================================');
  }

  updateMerchant(data) {
    if (this.businessInfoForm.invalid) {
      this.sharedService.swalAlertMessage('Update Information', 'All field are required', 'error');
    }
    const requestBody = {
      'name': this.businessInfoForm.value.businessName,
      'businessPhoneNumber': this.businessInfoForm.value.businessPhoneNumber,
      'email': this.businessInfoForm.value.businessEmail,
      'businessAddress': this.businessInfoForm.value.businessAddress,
      'businessNumber': this.businessInfoForm.value.businessNumber,
      'settlementAccountNumber': this.merchantBusinessInfo.settlementAccountNumber,
      'bankCode': this.merchantBusinessInfo.bankCode,
      'status': this.merchantBusinessInfo.status,
      'cardPayment': this.merchantBusinessInfo.cardPayment,
      'qrPayment': this.merchantBusinessInfo.qrPayment,
      'ussdPayment': this.merchantBusinessInfo.ussdPayment,
      'accountPayment': this.merchantBusinessInfo.accountPayment,
      'isMerchantBearer': this.merchantBusinessInfo.isMerchantBearer,
      'walletPayment': this.merchantBusinessInfo.walletPayment,
      'businessType': this.merchantBusinessInfo.businessType,
      'transactionLimit': this.merchantBusinessInfo.transactionLimit,
    };
    this.settingService.updateMerchant(this.merchantId, requestBody).subscribe(response => {
      if (response.body.status === 'SUCCESS') {
        this.getMerchant();
        this.sharedService.swalAlertMessage('Update user info', 'Updated successfuly', 'success');
      } else {
        this.sharedService.swalAlertMessage('Update user info', 'Not updated successfuly', 'error');
      }
    }, error => {
      this.handleErrors(error.error);
    });

  }

  getBanks() {
    this.merchantService.viewAllBanks().subscribe(response => {
      this.banks = response.data.banks;
    });
  }
  copyInputMessage(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }
  updatePersonalInfo(data) {
    if (this.personalInfoForm.invalid) {
      this.sharedService.swalAlertMessage('Update Information', 'All field are required', 'error');
    }
    const requestBody = {
      'firstName': this.personalInfoForm.value.firstName,
      'lastName': this.personalInfoForm.value.lastName,
      'email': this.personalInfoForm.value.email,
      'address': this.personalInfoForm.value.adddress,
      'phone': this.personalInfoForm.value.phone,
    };
    this.settingService.updateUser(this.uniqueKey, requestBody).subscribe(response => {
      if (response.body.status === 'SUCCESS') {
        this.sharedService.swalAlertMessage('Update user info', 'Updated successfuly', 'success');
      } else {
        this.sharedService.swalAlertMessage('Update user info', 'Not updated successfuly', 'error');
      }
    }, error => {
      this.handleErrors(error.error);
    });
  }

  bankAccountInfo() {
    this.bankAccountForm.setValue({
      'settlementAccountName': (this.merchantBusinessInfo.settlementAccountName) ? this.merchantBusinessInfo.settlementAccountName : '',
      // tslint:disable-next-line:max-line-length
      'settlementAccountNumber': (this.merchantBusinessInfo.settlementAccountNumber) ? this.merchantBusinessInfo.settlementAccountNumber : '',
      'bankCode': (this.merchantBusinessInfo.bankCode) ? this.merchantBusinessInfo.bankCode : ''
    });
  }

  updateBankAccountInfo(data) {
    if (this.bankAccountForm.invalid) {
      this.sharedService.swalAlertMessage('Bank Account', 'All field are required', 'error');
    }
    const requestBody = {
      'settlementAccountName': this.bankAccountForm.value.settlementAccountName,
      'settlementAccountNumber': this.bankAccountForm.value.settlementAccountNumber,
      'bankCode': this.bankAccountForm.value.bankCode,
      'name': this.merchantBusinessInfo.name,
      'businessPhoneNumber': this.merchantBusinessInfo.businessPhoneNumber,
      'email': this.merchantBusinessInfo.email,
      'businessAddress': this.merchantBusinessInfo.businessAddress,
      'businessNumber': this.merchantBusinessInfo.businessNumber,
      'status': this.merchantBusinessInfo.status,
      'cardPayment': this.merchantBusinessInfo.cardPayment,
      'qrPayment': this.merchantBusinessInfo.qrPayment,
      'ussdPayment': this.merchantBusinessInfo.ussdPayment,
      'accountPayment': this.merchantBusinessInfo.accountPayment,
      'isMerchantBearer': this.merchantBusinessInfo.isMerchantBearer,
      'walletPayment': this.merchantBusinessInfo.walletPayment,
      'businessType': this.merchantBusinessInfo.businessType,
      'transactionLimit': this.merchantBusinessInfo.transactionLimit,
    };
    this.settingService.updateMerchant(this.merchantId, requestBody).subscribe(response => {
      if (response.body.status === 'SUCCESS') {
        this.sharedService.swalAlertMessage('Bank Account', 'Updated successfuly', 'success');
      } else {
        this.sharedService.swalAlertMessage('Bank Account', 'Not updated successfuly', 'error');
      }
    }, error => {
      this.handleErrors(error.error);
    });
  }

  paymentSetup() {
    this.paymentSetupForm.setValue({
      'accountPayment': (this.merchantBusinessInfo.accountPayment === 'ACTIVE') ? true : false,
      'qrPayment': (this.merchantBusinessInfo.qrPayment === 'ACTIVE') ? true : false,
      'ussdPayment': (this.merchantBusinessInfo.ussdPayment === 'ACTIVE') ? true : false,
      'walletPayment': (this.merchantBusinessInfo.walletPayment === 'ACTIVE') ? true : false,
      'cardPayment': (this.merchantBusinessInfo.cardPayment === 'ACTIVE') ? true : false,
    });
    this.getAllBanks();
    this.viewAllMerchant();
  }

  updatePaymentSetup(data) {
    if (this.paymentSetupForm.invalid) {
      this.sharedService.swalAlertMessage('Payment Setup', 'All field are required', 'error');
    }
    const requestBody = {
      'accountPayment': (this.paymentSetupForm.value.accountPayment === true) ? STATUS.ACTIVE : STATUS.INACTIVE,
      'qrPayment': (this.paymentSetupForm.value.qrPayment === true) ? STATUS.ACTIVE : STATUS.INACTIVE,
      'ussdPayment': (this.paymentSetupForm.value.ussdPayment === true) ? STATUS.ACTIVE : STATUS.INACTIVE,
      'walletPayment': (this.paymentSetupForm.value.walletPayment === true) ? STATUS.ACTIVE : STATUS.INACTIVE,
      'cardPayment': (this.paymentSetupForm.value.cardPayment === true) ? STATUS.ACTIVE : STATUS.INACTIVE,
      'settlementAccountName': this.merchantBusinessInfo.settlementAccountName,
      'settlementAccountNumber': this.merchantBusinessInfo.settlementAccountNumber,
      'bankCode': this.merchantBusinessInfo.bankCode,
      'name': this.merchantBusinessInfo.name,
      'businessPhoneNumber': this.merchantBusinessInfo.businessPhoneNumber,
      'email': this.merchantBusinessInfo.email,
      'businessAddress': this.merchantBusinessInfo.businessAddress,
      'businessNumber': this.merchantBusinessInfo.businessNumber,
      'status': this.merchantBusinessInfo.status,
      'isMerchantBearer': this.merchantBusinessInfo.isMerchantBearer,
      'businessType': this.merchantBusinessInfo.businessType,
      'transactionLimit': this.merchantBusinessInfo.transactionLimit,
    };
    this.settingService.updateMerchant(this.merchantId, requestBody).subscribe(response => {
      if (response.body.status === 'SUCCESS') {
        this.sharedService.swalAlertMessage('Payment Setup', 'Updated successfuly', 'success');
        this.getMerchant();
      } else {
        this.sharedService.swalAlertMessage('Payment Setup', 'Not updated successfuly', 'error');
      }
    }, error => {
      this.handleErrors(error.error);
    });
  }

  update(data) {
    if (this.personalInfoForm.invalid) {
      this.sharedService.swalAlertMessage('Update Bnak Account', 'All field are required', 'error');
    }
    const requestBody = {
      'firstName': this.personalInfoForm.value.firstName,
      'lastName': this.personalInfoForm.value.lastName,
      'email': this.personalInfoForm.value.email,
      'address': this.personalInfoForm.value.adddress,
      'phone': this.personalInfoForm.value.phone
    };
    this.settingService.updateUser(this.uniqueKey, requestBody).subscribe(response => {
      if (response.body.status === 'SUCCESS') {
        this.sharedService.swalAlertMessage('Update user info', 'Updated successfuly', 'success');
      } else {
        this.sharedService.swalAlertMessage('Update user info', 'Not updated successfuly', 'error');
      }
    }, error => {
      this.handleErrors(error.error);
    });
  }

  getAllBanks(pageNum = 1) {
    this.whichForm = 'viewBank';
    this.pageNum = pageNum;
    const pageSize = 10;
    if (this.pageNum > 1) {
      this.indexPassed = (pageSize * (this.pageNum - 1)) + 1;
    } else {
      this.indexPassed = pageNum;
    }
    this.bankService.viewAllBanks(this.merchantId, pageSize, pageNum).subscribe(response => {
      this.allBanks = response.data;
      this.pageNumber = this.banks.pageNumber;
      this.lastPage = this.allBanks.last;
      const returnedPageSize = this.allBanks.totalPages - 1;
      const pageNumberArray = [];
      let i = 1;
      for (i = 1; i <= returnedPageSize; i++) {
        pageNumberArray.push(i);
      }
      this.pages = pageNumberArray;
    });
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
      this.allBanks = response.data;
      this.pageNumber = this.allBanks.pageNumber;
      this.lastPage = this.allBanks.last;
      const returnedPageSize = this.allBanks.totalPages - 1;
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
    this.bankService.viewAllMerchant(2000, 0).subscribe(response => {
      this.merchants = response.data.merchants.content;
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
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

  updateStatus(data) {
    const body = {
      'bankName': data.bankName,
      'isBvnRequired': data.isBvnRequired,
      'isDateOfBirthRequired': data.isDateOfBirthRequired,
      'isEmailRequired': data.isEmailRequired,
      'logoUrl': data.logoUrl,
      'status': (data.status === 'ACTIVE') ? 'INACTIVE' : 'ACTIVE',
    };
    this.bankService.updateBank(data.bankCode, body).subscribe(response => {
      if (response.body.status === 'SUCCESS') {
        this.getAllBanks();
        this.sharedService.swalAlertMessage('Bank Status Update', 'Bank status updated successfully', 'success');
      }
    });
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

enum STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}
