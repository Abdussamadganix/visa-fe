import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Constants } from 'src/app/constants';
import { HomeService } from '../home.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import * as sha1 from 'sha1';
import { SharedService } from 'src/app/service/shared.service';
import { CustomValidator } from 'src/app/validation/CustomValidator ';
import { NgxSpinnerService } from 'ngx-spinner';
const ACTIVATION = Constants.FORGOT_PASSWORD;

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})

export class ForgotPasswordComponent implements OnInit {
  readonly resetLink = ACTIVATION;
  forgotPasswordForm: FormGroup;
  resetPasswordForm: FormGroup;
  whichForm: any = 'viewForgotPasswordForm';
  email: any;
  handle: any;
  token: any;
  submitted: boolean;
  constructor(private formBuilder: FormBuilder,
    private homeService: HomeService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private spinner: NgxSpinnerService
    ) { }

  ngOnInit() {
    localStorage.clear();
    this.forgotPasswordForm = this.formBuilder.group({
      'email': ['', [Validators.required, Validators.email]]
    });
    this.resetPasswordForm = this.formBuilder.group({
      'password': ['', [Validators.required, CustomValidator.passwordValidator]],
      'confirmPassword': ['', Validators.required],
    });
    this.whichForm = 'viewForgotPasswordForm';
    const route = this.activatedRoute.snapshot.paramMap.get('activationCode');
    if (route !== null) {
      const code = atob(route);
      const splitCode = code.split('|');
      this.handle = splitCode['0'];
      this.token = splitCode['1'];
      const hash = splitCode['2'];
      this.email = splitCode['3'];
      const compare = sha1(this.handle + this.token);
      if (hash !== compare) {
        swal({
          title: 'Confirm Email',
          text: 'Invalid activation code',
          type: 'error',
          confirmButtonText: 'Ok',
          customClass: 'sweet-alert',
          allowOutsideClick: false
        }).then(() => {
          this.router.navigateByUrl('/home');
        });
        return;
      } else {
        this.whichForm = 'viewResetPasswordForm';
        return;
      }
    }
  }

  resetPAssword(data) {
    if (!this.resetPasswordForm.valid) {
      console.log(this.resetPasswordForm);
      this.submitted = true;
      const message = 'All Field are required';
      // swal({
      //   title: 'Reset Password',
      //   text: message,
      //   type: 'info',
      //   confirmButtonText: 'Ok',
      //   customClass: 'sweet-alert',
      //   allowOutsideClick: false
      // });
      // setTimeout(() => {
      //   this.submitted = false;
      // }, 5000);
      return;
    }
    if (data.password !== data.confirmPassword) {
      this.sharedService.swalAlertMessage('Error!', 'Password does not match', 'error');
      return;
    }
    const body = {
      'email': this.email,
      'password': this.resetPasswordForm.value.password,
      'twoFactorAuthentication': {
        'token': this.token,
        'handle': this.handle
      }
    };
    this.submitted = false;
    this.spinner.show();
    this.homeService.resetPasword(body).subscribe(response => {
    this.spinner.hide();
      if (response.status === 'SUCCESS') {
        const message = 'Password reset successful';

        swal({
          title: 'Reset Password',
          text: message,
          type: 'info',
          confirmButtonText: 'Ok',
          customClass: 'sweet-alert',
          allowOutsideClick: false
        }).then(() => {
          this.router.navigateByUrl('/login');
        });
        return;
      }
    }, error => {
      this.handleErrors(error.error);
    });
  }

  get password() {
    return this.resetPasswordForm.get('password');
  }

  onPasswordStrengthChanged(strength) {
    // console.log(strength);
    // console.log('====================================');
    // console.log('onPasswordStrengthChanged', strength);
    // console.log('====================================');
  }

  get appName() { return this.resetPasswordForm.get('password'); }

  get f() { return this.resetPasswordForm.controls; }
  get r() { return this.forgotPasswordForm.controls; }

  forgotPassword() {
    this.submitted = true;
    if (!this.forgotPasswordForm.valid) {
      const message = 'Please enter a valid email address';
      swal({
        title: 'Forgot Password',
        text: message,
        type: 'info',
        confirmButtonText: 'Ok',
        customClass: 'sweet-alert',
        allowOutsideClick: false
      });
      return;
    }
    const body = {
      'email': this.forgotPasswordForm.value.email,
      'redirectUrl': this.resetLink,
      'requestType': 'RESET_PASSWORD',
    };
    this.submitted = false;
    this.spinner.show();
    this.homeService.forgortPassword(body).subscribe(response => {
    this.spinner.hide();
      if (response.status === 'SUCCESS') {
        // tslint:disable-next-line:max-line-length
        const message = 'Password reset link sent successfully, kindly check your email ( ' + this.forgotPasswordForm.value.email + ') to reset  your password';
        swal({
          title: 'Forgot Password',
          text: message,
          type: 'info',
          confirmButtonText: 'Ok',
          customClass: 'sweet-alert',
          allowOutsideClick: false
        }).then(() => {
          this.router.navigateByUrl('/login');
        });
        return;
      }
    }, error => {
      this.handleErrors(error.error);
    });
  }

  backToHome() {
    this.router.navigateByUrl('/home');
  }

  handlePasswordExpired() {
    const body = {
      'email': this.email,
      'redirectUrl': this.resetLink,
      'requestType': 'RESET_PASSWORD',
    };
    this.spinner.show();
    this.homeService.verifyEmail(body).subscribe(response1 => {
    this.spinner.hide();
      if (response1.status === 'SUCCESS') {
        const message = 'Password reset link sent successfully, kindly check your email ( ' + this.email + ') to reset your password';
        swal({
          title: 'Confirm Email',
          text: message,
          type: 'info',
          confirmButtonText: 'Ok',
          customClass: 'sweet-alert',
          allowOutsideClick: false
        }).then(() => {
          this.router.navigateByUrl('/home');
        });
        return;
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
    } else if (error.status === 'FAILED' && error.error === 'NOT_FOUND') {
      errorMessage = error.message;
      swal({
        title: 'Confirm Email',
        text: errorMessage,
        type: 'error',
        confirmButtonText: 'Ok',
        customClass: 'sweet-alert',
        allowOutsideClick: false
      })
        .then(() => {
          this.router.navigateByUrl('register');
        });
      return;
    } else if (error.status === 'FAILED' && error.error === 'PERMISSION') {
      errorMessage = error.message;
      swal({
        title: 'Confirm Email',
        text: 'Password reset link expired, kindly clik on OK to send a new passowrd reset link',
        type: 'error',
        confirmButtonText: 'Ok',
        customClass: 'sweet-alert',
        allowOutsideClick: false
      })
        .then(() => {
          this.handlePasswordExpired();
        });
      return;
    } else {
      errorMessage = 'An error occured';
    }
    this.sharedService.swalAlertMessage('Error!', errorMessage, 'error');
  }
}

