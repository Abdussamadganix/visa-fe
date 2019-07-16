import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HomeService } from '../home.service';
import { Constants } from '../../constants';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/service/shared.service';
import { JscriptService } from 'src/app/service/jscript.service';
import { CustomValidator } from 'src/app/validation/CustomValidator ';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;
// import * as $ from 'jquery';

const ACTIVATION = Constants.ACTIVATION_LINK;
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  powers: any = [];
  readonly activationLink = ACTIVATION;
  registerationForm: FormGroup;
  businessNumber: boolean;
  submitted: boolean;
  constructor(private formBuilder: FormBuilder,
    private homeService: HomeService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private sharedService: SharedService,
    private jscript: JscriptService) { }

  ngOnInit() {
    const load8 = './assets/custom/js/custom.js';
    this.jscript.load(load8).then(e => true)
      .catch(e => false);
    const a = JSON.parse(this.sharedService.getCurrentUser());
    this.businessNumber = false;
    this.registerationForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, CustomValidator.passwordValidator]],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      businessName: ['', Validators.required],
      isDeveloper: [''],
      businessType: ['', Validators.required],
      termsAndCondition: [''],
    });
  }

  onPasswordStrengthChanged(strength) {
    // console.log('====================================');
    // console.log('onPasswordStrengthChanged', strength);
    // console.log('====================================');
  }

  get password() {
    return this.registerationForm.get('password');
  }
  get f() { return this.registerationForm.controls; }

  createUser(data) {
    if (!this.registerationForm.valid) {
      this.submitted = true;
      setTimeout(() => {
        this.submitted = false;
      }, 5000);
      return;
    }
    if (this.registerationForm.value.termsAndCondition === false || this.registerationForm.value.termsAndCondition === null
      || this.registerationForm.value.termsAndCondition === undefined || this.registerationForm.value.termsAndCondition === '') {
      this.sharedService.swalAlertMessage('User Registration', 'Please accept our terms of service', 'info');
      return;
    }
    const requestBody = {
      'firstName': this.registerationForm.value.firstName,
      'lastName': this.registerationForm.value.lastName,
      'email': this.registerationForm.value.email,
      'password': this.registerationForm.value.password,
      'address': this.registerationForm.value.address,
      'phone': this.registerationForm.value.phone,
      'businessName': this.registerationForm.value.businessName,
      'businessType': this.registerationForm.value.businessType,
      'isDeveloper': (this.registerationForm.value.isDeveloper === true) ? 'ACTIVE' : 'INACTIVE',
    };
    this.spinner.show();
    this.homeService.createUser(requestBody).subscribe(response => {
      this.spinner.hide();
      if (response.status === 'SUCCESS') {
        this.sharedService.swalAlertMessage('Registration',
        'Registration successful, kindly check your email ( ' + data.email + ') to activate your account',
        'success');
        setTimeout(() => {
        this.router.navigateByUrl('/home');
        }, 3000);
        const body = {
          'email': this.registerationForm.value.email,
          'redirectUrl': this.activationLink,
          'requestType': 'SIGN_UP',
        };
        this.homeService.verifyEmail(body).subscribe(response1 => {
          // if (response1.status === 'SUCCESS') {
          //   this.registerationForm.reset();
          //   this.sharedService.swalAlertMessage('Registration',
          //     'Registration successful, kindly check your email ( ' + data.email + ') to activate your account',
          //     'success');
          //     setTimeout(() => {
          //     this.router.navigateByUrl('/home');
          //     }, 3000);
          // }
        }, error => {
          this.spinner.hide();
          // this.handleErrors(error.error);
        });
      }
    }, error => {
      this.spinner.hide();
      this.handleErrors(error.error);
    });
  }

  handleAccountNumber(event: KeyboardEvent, accountNumber) {
    const index = [46, 8, 9, 27, 13, 110].indexOf(event.keyCode);
    if (index !== -1 || (event.keyCode === 65 && (event.ctrlKey === true || event.metaKey === true))
      || (event.keyCode >= 35 && event.keyCode <= 40)) {
      return;
    }
    if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
      event.preventDefault();
    }
    const removeSpace = accountNumber.replace(/\s/g, '');
    if (removeSpace.length > 20) {
      event.preventDefault();
    }
  }

  displayBusinessNumber(event) {
    if (event.target.value === 'REGISTERED') {
      this.businessNumber = true;
    } else {
      this.businessNumber = false;
    }
  }

  backToHome() {
    this.router.navigateByUrl('/home');
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
