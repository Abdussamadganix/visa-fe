import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService } from '../home.service';
import { SharedService } from 'src/app/service/shared.service';
import { Constants } from '../../constants';
import swal from 'sweetalert2';
import * as sha1 from 'sha1';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { CustomValidator } from 'src/app/validation/CustomValidator ';
const ACTIVATION = Constants.ACTIVATION_LINK;
const SETPASSWORD = Constants.SET_PASSWORD;
const FORGOTPASSWORD = Constants.FORGOT_PASSWORD;
const RESETLINK = Constants.RESET_LINK;
@Component({
  selector: 'app-activate-user',
  templateUrl: './activate-user.component.html',
  styleUrls: ['./activate-user.component.css']
})
export class ActivateUserComponent implements OnInit {
  readonly activationLink = ACTIVATION;
  readonly resetLink = RESETLINK;
  readonly forPassowrdLink = FORGOTPASSWORD;
  readonly setPasswordLink = SETPASSWORD;
  email: any;
  code: any;
  basePath: any;
  whichForm: any;
  // whicForm: any = 'viewEmailForm';
  resetPasswordForm: FormGroup;
  setPasswordForm: FormGroup;
  submitted: boolean;
  token: any;
  handle: any;
  constructor(private activatedRoute: ActivatedRoute,
    private homeService: HomeService,
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private router: Router) { }
  ngOnInit() {
    localStorage.clear();
    const path = this.router.url ? this.router.url.split('/') : '';
    this.basePath = path[1];
    this.code = atob(this.activatedRoute.snapshot.paramMap.get('activationCode'));
    if (this.code === null || this.code === undefined) {
      this.router.navigateByUrl('/');
      return;
    }

    this.resetPasswordForm = this.formBuilder.group({
      'password': ['', [Validators.required, CustomValidator.passwordValidator]],
      'confirmPassword': ['', Validators.required],
    });
    const splitCode = this.code.split('|');
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
    }
    if (this.basePath === 'set-password') {
      this.whichForm = 'viewSetPasswordForm';
      this.setPasswordForm = this.formBuilder.group({
        // 'email': ['', [Validators.required]],
        'email': new FormControl({ value: this.email, disabled: true }),
        'password': ['', [Validators.required, CustomValidator.passwordValidator]],
        'confirmPassword': ['', [Validators.required]]
      });
    } else if (this.basePath === 'activate-email') {
      this.confirmEmail();
      return;
    } else {
      this.whichForm = 'viewResetPasswordForm';
    }
  }


  setPassword(data) {
    this.submitted = true;
    if (this.setPasswordForm.invalid) {
      return;
    }
    if (this.setPasswordForm.value.password !== this.setPasswordForm.value.confirmPassword) {
      this.sharedService.swalAlertMessage('Error!', 'Password does not match', 'error');
      return;
    }
    const body = {
      'email': this.email,
      'password': this.setPasswordForm.value.password,
      'twoFactorAuthentication': {
        'token': this.token,
        'handle': this.handle
      }
    };
    this.submitted = false;
    this.homeService.resetPasword(body).subscribe(response => {
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

  confirmEmail() {
    const requestBody = {
      'email': this.email,
      'twoFactorAuthentication': {
        'token': this.token,
        'handle': this.handle
      }
    };
    this.homeService.confirmEmail(requestBody).subscribe(response => {
      if (response.status === 'SUCCESS') {
        const message = 'Account activated successfully, you can now login';

        swal({
          title: 'Account Activation',
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

  resetPassword(data) {
    this.submitted = true;
    if (this.resetPasswordForm.invalid) {
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
    this.homeService.resetPasword(body).subscribe(response => {
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
  
  get f() { return this.resetPasswordForm.controls; }
  get r() { return this.setPasswordForm.controls; }

  verifyEmail(data) {
    this.submitted = true;
    if (this.setPasswordForm.invalid) {
      return;
    }
    const body = {
      'email': this.setPasswordForm.value.email,
      'redirectUrl': this.resetLink,
      'requestType': 'RESET_PASSWORD',
    };
    this.submitted = false;
    this.homeService.forgortPassword(data).subscribe(response => {
      if (response.status === 'SUCCESS') {
        const message = 'Activation link sent successfully, kindly check your email ( ' + this.email + ') to activate your account';

        swal({
          title: 'Confirm Email',
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

  onPasswordStrengthChanged(strength) {
    // console.log('====================================');
    // console.log('onPasswordStrengthChanged', strength);
    // console.log('====================================');
  }

  get password() {
    return this.setPasswordForm.get('password');
  }

  backToHome() {
    this.router.navigateByUrl('/home');
  }

  handlePasswordExpired() {
    let redirectUrl;
    let requestType;
    if (this.basePath === 'activate-email') {
      redirectUrl = this.activationLink;
      requestType = 'SIGN_UP';
    } else if (this.basePath === 'set-password') {
      redirectUrl = this.setPasswordLink;
      requestType = 'RESET_PASSWORD';
    } else {
      redirectUrl = this.resetLink;
      requestType = 'RESET_PASSWORD';
    }
    const body = {
      'email': this.email,
      'redirectUrl': redirectUrl,
      'requestType': requestType,
    };
    this.homeService.verifyEmail(body).subscribe(response1 => {
      if (response1.status === 'SUCCESS') {
        const message = 'Activation link sent successfully, kindly check your email ( ' + this.email + ') to activate your account';
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
          this.router.navigateByUrl('home');
        });
      return;
    } else if (error.status === 'FAILED' && error.error === 'PERMISSION') {
      errorMessage = error.message;
      swal({
        title: 'Confirm Email',
        text: 'Activation link expired, kindly clik on OK to send a new activation link',
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

