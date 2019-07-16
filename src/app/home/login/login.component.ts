import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { HomeService } from '../home.service';
import { Constants } from '../../constants';
import { RouterLink, Router } from '@angular/router';
import { SharedService } from 'src/app/service/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';

const ACTIVATION = Constants.ACTIVATION_LINK;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  submitted: boolean;
  errorMessage: string;
  successMessage: string;
  authenticationForm: FormGroup;
  readonly activationLink = ACTIVATION;
  email: string;
  constructor(private formBuilder: FormBuilder,
    private homeService: HomeService,
    private router: Router,
    private sharedService: SharedService,
    private spinner: NgxSpinnerService) { }


  ngOnInit() {
    this.submitted = false;
    localStorage.clear();
    this.authenticationForm = this.formBuilder.group({
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', Validators.required],
      'remermberMe': ['']
    });
  }
  authUser(data) {
    if (this.authenticationForm.invalid) {
      this.submitted = true;
      this.errorMessage = 'All fields are required';
      setTimeout(() => {
        this.errorMessage = '';
      }, 5000);
      // this.sharedService.swalAlertMessage('Login', 'All fields are required', 'info');
      return;
    }
    this.email = this.authenticationForm.value.email;
    const requestBody = {
      email: this.authenticationForm.value.email,
      password: this.authenticationForm.value.password,
    };
    this.spinner.show();
    this.homeService.authUser(requestBody).subscribe(response => {
      this.spinner.hide();
      if (response.status === 'SUCCESS') {
        this.homeService.setCredentials(response.data);
        if (response.data.user.isRegistrationComplete === 0) {
          localStorage.setItem('isRegistrationComplete', '0');
          // response.data.user.isRegistrationComplete

          this.router.navigateByUrl('/starter/business-information');
          return;
        } else {
          localStorage.setItem('isRegistrationComplete', '1');
          this.router.navigateByUrl('/dashboard');
        }
      }
    }, error => {
      this.handleErrors(error.error);
    });
  }

  get f() { return this.authenticationForm.controls; }

  backToHome() {
    this.router.navigateByUrl('/home');
  }

  resendEmail() {
    const body = {
      'email': this.email,
      'redirectUrl': this.activationLink,
      'requestType': 'SIGN_UP',
    };
    this.homeService.verifyEmail(body).subscribe(response1 => {
      if (response1.status === 'SUCCESS') {
        this.sharedService.swalAlertMessage('Activation Link',
          'Activatiion Link has been sent to your email, kindly check your email ( ' + this.email + ') to activate your account',
          'success');
        setTimeout(() => {
          this.router.navigateByUrl('/home');
        }, 3000);
      }
    }, error => {
      this.spinner.hide();
      // this.handleErrors(error.error);
    });
  }

  handleErrors(error) {
    this.spinner.hide();
    if (error.status === 'FAILED' && error.error === 'INPUT') {
      swal({
        title: 'Account Activation',
        text: 'You are yet to activate your account. Kindly, check you email or click on ok to resend activation link',
        type: 'info',
        confirmButtonText: 'Ok',
        customClass: 'sweet-alert',
        allowOutsideClick: false
      }).then(() => {
        this.resendEmail();

      });
      return;
    } else if (error.status === 'FAILED' && error.error === 'PROCESSING') {
      this.errorMessage = 'An error occured';
    } else if (error.status === 'FAILED' && error.error === 'AUTHENTICATION') {
      this.errorMessage = 'Invalid username or Password';
    } else if (error.status === 'FAILED' && error.error === 'PERMISSION') {
      this.errorMessage = error.message;
    } else {
      this.errorMessage = 'Please try again later';
    }
    setTimeout(() => {
      this.errorMessage = '';
    }, 7000);
    this.sharedService.swalAlertMessage('Error!', this.errorMessage, 'error');
  }
}


