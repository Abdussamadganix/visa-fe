import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SharedService } from '../service/shared.service';
import { MerchantService } from '../merchant/merchant.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { SettingsService } from '../settings/settings.service';
import { StarterService } from './starter.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import * as $ from 'jquery';
import { Location } from '@angular/common';

@Component({
  selector: 'app-starter',
  templateUrl: './starter.component.html',
  styleUrls: ['./starter.component.css']
})
export class StarterComponent implements OnInit {

  usersInfo: any;
  personalInfoForm: FormGroup;
  businessInfoForm: FormGroup;
  bankAccountForm: FormGroup;
  verificationForm: FormGroup;
  uploadFormReg: FormGroup;
  uploadFormStarter: FormGroup;
  uniqueKey: string;
  merchantId: string;
  num: number;
  dataSource: any = [];
  merchantKeyInfoForm: FormGroup;
  paymentSetupForm: FormGroup;
  banks: any;
  viewMerchantModel: any;
  merchantBusinessInfo: any;
  extensions: any = ['png', 'PNG', 'PDF', 'pdf', 'jpg', 'JPG', 'JPEG', 'jpeg', 'BMP', 'bmp'];
  selectedFile: any;
  check: any;
  name: any;
  displayAccountName: boolean;
  businessType: string;
  fileName: string;
  fileToUpload: File = null;
  message: any;
  isRegistered: boolean;
  whichDisplay: String;
  business: boolean;
  identity: boolean;
  payment: boolean;
  account: boolean;
  @ViewChild('settlementAccountNumber') private settlementAccountNumber: ElementRef;
  @ViewChild('bankCode') private bankCode: ElementRef;
  constructor(private fb: FormBuilder,
    private settingService: SettingsService,
    private sharedService: SharedService,
    private merchantService: MerchantService,
    public toastr: ToastrManager,
    private staterService: StarterService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private location: Location) {
    this.business = true;
    this.identity = true;
    this.account = true;
    this.payment = true;
  }

  ngOnInit() {

    this.num = 0;
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
      'businessAddress': ['']
    });
    this.bankAccountForm = this.fb.group({
      'accountName': [''],
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
    this.uploadFormReg = this.fb.group({
      'identification': [''],
      'businessNumber': ['', Validators.required],
      'file': [''],
      'businessNumberType': ['', Validators.required],
    });

    this.uploadFormStarter = this.fb.group({
      'identification': ['', Validators.required],
      'file': [''],
    });
    this.sharedService.getUser();
    this.uniqueKey = this.sharedService.getUserUniqueId();
    this.merchantId = this.sharedService.getMerchantId();
    this.businessType = this.sharedService.getBusinessType();
    this.getMerchant();
    this.getBanks();
    if (this.router.url === '/starter/identity-validation') {
      $('#navidentityverificationtab').addClass('active');
      this.whichDisplay = 'identityVerification';
    } else if (this.router.url === '/starter/account-validation') {
      this.whichDisplay = 'accountValidaion';
      $('#navaccounttab').addClass('active');
    } else if (this.router.url === '/starter/payment-setup') {
      this.whichDisplay = 'paymentSetUp';
      $('#paymentSetup').addClass('active');
    } else {
      this.whichDisplay = 'businessInformation';
      $('#navbusinesstab').addClass('active');
    }
  }

  showSuccess() {
    this.toastr.successToastr('Update successful.', 'Success!');
  }

  uploadFile(files) {
    this.fileToUpload = files.target.files.item(0);
    // this.fileToUpload = files.item(0);
    const fileExtension = this.fileToUpload.name.substr(this.fileToUpload.name.lastIndexOf('.') + 1);
    this.check = this.extensions.includes(fileExtension);
    if (this.check === false) {
      const errorMessage = 'File type not allowed';
      this.sharedService.swalAlertMessage('Error!', errorMessage, 'error');
      $('#file').val('');
      return;
    }
  }
  onAddData() {
    this.dataSource.push(this.dataSource.length);
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
    this.spinner.show();
    this.settingService.getMerchant(this.merchantId).subscribe(response => {
      this.spinner.hide();
      const merchantKeyInfo = response.data.credentials;
      this.merchantBusinessInfo = response.data.merchant;
      this.fileName = (this.merchantBusinessInfo.fileName == null) ? 'No file Uploaded ' : this.merchantBusinessInfo.fileName ;
      this.businessInfoForm.setValue({
        'businessName': this.merchantBusinessInfo.name,
        'businessPhoneNumber': (this.merchantBusinessInfo.businessPhoneNumber) ? this.merchantBusinessInfo.businessPhoneNumber : '',
        'businessEmail': this.merchantBusinessInfo.email,
        'businessAddress': this.merchantBusinessInfo.businessAddress,
      });
      this.paymentSetupForm.setValue({
        'accountPayment': (this.merchantBusinessInfo.accountPayment === 'ACTIVE') ? true : false,
        'qrPayment': (this.merchantBusinessInfo.qrPayment === 'ACTIVE') ? true : false,
        'ussdPayment': (this.merchantBusinessInfo.ussdPayment === 'ACTIVE') ? true : false,
        'walletPayment': (this.merchantBusinessInfo.walletPayment === 'ACTIVE') ? true : false,
        'cardPayment': (this.merchantBusinessInfo.cardPayment === 'ACTIVE') ? true : false,
      });
      this.bankAccountForm.setValue({
        'accountName': (this.merchantBusinessInfo.accountName) ? this.merchantBusinessInfo.accountName : '',
        // tslint:disable-next-line:max-line-length
        'settlementAccountNumber': (this.merchantBusinessInfo.settlementAccountNumber) ? this.merchantBusinessInfo.settlementAccountNumber : '',
        'bankCode': (this.merchantBusinessInfo.bankCode) ? this.merchantBusinessInfo.bankCode : ''
      });
      this.uploadFormReg.setValue({
        'businessNumber': (this.merchantBusinessInfo.settlementAccountNumber) ? this.merchantBusinessInfo.settlementAccountNumber : '',
        'businessNumberType': (this.merchantBusinessInfo.businessNumberType) ? this.merchantBusinessInfo.businessNumberType : '',
        'identification': (this.merchantBusinessInfo.identification) ? this.merchantBusinessInfo.identification : '',
        'file': (this.merchantBusinessInfo.file) ? '' : ''
      });
      this.uploadFormStarter.setValue({
        'identification': (this.merchantBusinessInfo.identification) ? this.merchantBusinessInfo.identification : '',
        'file': (this.merchantBusinessInfo.file) ? '' : ''
      });
    }, error => {
      this.spinner.hide();
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

  backClicked() {
    this.location.back();
  }

  updateVerification(data) {
    const fd = new FormData();
    if (this.businessType === 'REGISTERED') {
      if (!this.uploadFormReg.valid) {
        alert(1);
        this.sharedService.swalAlertMessage('Update Information', 'All field are required', 'error');
        return;
      }
      fd.append('file', this.fileToUpload);
      fd.append('businessNumber', this.uploadFormReg.value.businessNumber);
      fd.append('businessNumberType', this.uploadFormReg.value.businessNumberType);
      fd.append('identification', 'CAC');
    } else {
      if (!this.uploadFormStarter.valid) {
        this.sharedService.swalAlertMessage('Update Information', 'All field are required', 'error');
        return;
      }
      fd.append('file', this.fileToUpload);
      fd.append('identification', this.uploadFormReg.value.identification);
    }
    this.spinner.show();
    this.staterService.uploadFile(fd).subscribe(response => {
      this.spinner.hide();
      if (response.body.status === 'SUCCESS') {
        this.router.navigateByUrl('/starter/account-validation');
        this.sharedService.swalAlertMessage('File Upload', 'File Uploaded Successfully', 'success');
      }
    }, error => {
      this.handleErrors(error.error);
    });
  }
  updateMerchant(data) {
    if (this.businessInfoForm.invalid) {
      this.sharedService.swalAlertMessage('Update Merchant Information', 'All field are required', 'info');
    }
    const requestBody = {
      'name': this.businessInfoForm.value.businessName,
      'businessPhoneNumber': this.businessInfoForm.value.businessPhoneNumber,
      'email': this.businessInfoForm.value.businessEmail,
      'businessAddress': this.businessInfoForm.value.businessAddress,
      'businessType': this.merchantBusinessInfo.businessType,
      'transactionLimit': this.merchantBusinessInfo.transactionLimit,
    };
    this.spinner.show();
    this.settingService.updateMerchant(this.merchantId, requestBody).subscribe(response => {
      this.spinner.hide();
      if (response.body.status === 'SUCCESS') {
        this.router.navigateByUrl('/starter/identity-validation');
        this.sharedService.swalAlertMessage('Update user info', 'Updated successfuly', 'success');
      } else {
        this.sharedService.swalAlertMessage('Update user info', 'Not updated successfuly', 'info');
      }
    }, error => {
      this.spinner.hide();
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
    this.bankAccountForm.patchValue({
      'accountName': (this.merchantBusinessInfo.accountName) ? this.merchantBusinessInfo.accountName : '',
      // tslint:disable-next-line:max-line-length
      'settlementAccountNumber': (this.merchantBusinessInfo.settlementAccountNumber) ? this.merchantBusinessInfo.settlementAccountNumber : '',
      'bankCode': (this.merchantBusinessInfo.bankCode) ? this.merchantBusinessInfo.bankCode : ''
    });
  }

  updateBankAccountInfo(data) {
    if (this.bankAccountForm.invalid) {
      this.sharedService.swalAlertMessage('Bank Account', 'All field are required', 'info');
    }
    const nameEnquiryRequest = {
      'accountNumber': this.bankAccountForm.value.settlementAccountNumber,
      'bankCode': this.bankAccountForm.value.bankCode
    };
    this.spinner.show();
    this.staterService.nameEnquiry(nameEnquiryRequest).subscribe(response => {
      this.spinner.hide();
      if (response.status = 'SUCCESS') {
        this.displayAccountName = true;
        this.name = response.data.account.fullName;
        this.message = 'Account validated successfully with name: ' + this.name + ' click continue button to proceed';
        return;
      } else {
        this.spinner.hide();
        this.name = 'Account Validation Failed, if you wish to proceed click continue button';
      }
    }, error => {
      this.spinner.hide();
      this.displayAccountName = true;
      this.message = 'Account Validation Failed, if you wish to proceed click continue button';
      return;
    });
  }

  continue() {
    const requestBody2 = {
      'accountName': this.name,
      'settlementAccountNumber': this.settlementAccountNumber.nativeElement.value,
      'bankCode': this.bankCode.nativeElement.value,
    };
    this.spinner.show();
    this.settingService.updateMerchant(this.merchantId, requestBody2).subscribe(response => {
      this.spinner.hide();
      if (response.body.status === 'SUCCESS') {
        this.sharedService.swalAlertMessage('Bank Account', 'Updated successfuly', 'success');
        this.router.navigateByUrl('/starter/payment-setup');
      }
    }, error1 => {
      this.spinner.hide();
      // this.handleErrors(error.error);
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
  }

  updatePaymentSetup(data) {
    if (this.paymentSetupForm.invalid) {
      this.sharedService.swalAlertMessage('Payment Setup', 'All field are required', 'info');
    }
    const requestBody = {
      'accountPayment': (this.paymentSetupForm.value.accountPayment === true) ? STATUS.ACTIVE : STATUS.INACTIVE,
      'qrPayment': (this.paymentSetupForm.value.qrPayment === true) ? STATUS.ACTIVE : STATUS.INACTIVE,
      'ussdPayment': (this.paymentSetupForm.value.ussdPayment === true) ? STATUS.ACTIVE : STATUS.INACTIVE,
      'walletPayment': (this.paymentSetupForm.value.walletPayment === true) ? STATUS.ACTIVE : STATUS.INACTIVE,
      'cardPayment': (this.paymentSetupForm.value.cardPayment === true) ? STATUS.ACTIVE : STATUS.INACTIVE,
    };
    this.spinner.show();
    this.settingService.updateMerchant(this.merchantId, requestBody).subscribe(response => {
      this.spinner.hide();
      if (response.body.status === 'SUCCESS') {
        localStorage.removeItem('isRegistrationComplete');
        localStorage.setItem('isRegistrationComplete', '1');
        swal({
          title: 'Successful!',
          text: 'Updated Successfuly',
          type: 'success',
          confirmButtonText: 'Ok',
        }).then(() => {
          this.router.navigate(['/dashboard']);
        });
      } else {
        this.sharedService.swalAlertMessage('Payment Setup', 'Not updated successfuly', 'info');
      }
    }, error => {
      this.handleErrors(error.error);
    });
  }

  update(data) {
    if (this.personalInfoForm.invalid) {
      this.sharedService.swalAlertMessage('Update Bnak Account', 'All field are required', 'info');
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
