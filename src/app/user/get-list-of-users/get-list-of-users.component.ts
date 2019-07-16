import { UsersService } from '../users.service';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/service/shared.service';
import { OnDestroy, OnInit, Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { Constants } from 'src/app/constants';
import { JscriptService } from '../../service/jscript.service';
import { NgxSpinnerService } from 'ngx-spinner';
// import * as $ from 'jquery';
declare var $: any;

const SETPASSWORD = Constants.SET_PASSWORD;

@Component({
  selector: 'app-get-list-of-users',
  templateUrl: './get-list-of-users.component.html',
  styleUrls: ['./get-list-of-users.component.css']
})
export class GetListOfUsersComponent implements OnInit, OnDestroy {
  readonly setPasswordLink = SETPASSWORD;
  users: any = [];
  categories: any = [];
  temp_var: boolean;
  myTableWidget: any;
  userForm: FormGroup;
  edit: boolean;
  whichForm: any = 'inviteUserForm';
  inviteUserForm: FormGroup;
  resetPasswordForm: FormGroup;
  SetPasswordEmailForm: FormGroup;
  viewUserModel: any;
  roleId: any;
  merchantId: any;
  submitted: boolean;
  data: any;
  token: any;
  handle: any;
  email: any;
  pages: any;
  pageNum: any;
  firstPage: any;
  lastPage: any;
  pageNumber: any;
  indexPassed: number;

  constructor(
    private userService: UsersService,
    private router: Router,
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.edit = false;
    this.whichForm = 'viewUserTable';
    this.userForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      status: ['', Validators.required],
      address: [''],
      phone: ['', Validators.required],
    });
    this.inviteUserForm = this.formBuilder.group({
      'email': ['', [Validators.required, Validators.email]],
      'roleId': ['', Validators.required]
    });
    this.resetPasswordForm = this.formBuilder.group({
      'password': ['', Validators.required],
      'confirmPassword': ['', Validators.required],
    });
    this.SetPasswordEmailForm = this.formBuilder.group({
      'email': ['', [Validators.required, Validators.email]]
    });
    this.listOfUsers();
  }

  listOfUsers(pageNum = 0) {
    const pageSize = 10;
    if (pageNum === 0) {
      this.indexPassed = pageNum + 1;
    } else {
      this.indexPassed = (pageSize * (pageNum - 1)) + 1;
    }
    // @todo Sort by Column, add page filter
    this.spinner.show();
    this.userService.listOfUsers(pageSize, pageNum).subscribe(response => {
      this.spinner.hide();
      this.users = response.data.users.content;
      this.pageNumber = response.data.users.pageNumber;
      this.lastPage = response.data.users.last;
      this.temp_var = true;
      const returnedPageSize = response.data.users.totalPages - 1;
      const pageNumberArray = [];
      let i = 1;
      for (i = 1; i <= returnedPageSize; i++) {
        pageNumberArray.push(i);
      }
      this.pages = pageNumberArray;
    }, error => {
      this.spinner.hide();
    });
  }

  ngOnDestroy(): void {
  }

  viewUser(user) {
    this.whichForm = 'viewUpdateUserForm';
    this.edit = true;
    this.viewUserModel = Object.assign({}, user);
    this.userForm.setValue({
      'email': user.email,
      'firstName': user.firstName,
      'lastName': user.lastName,
      'phone': user.phone,
      'address': user.address ? user.address : '',
      'status': user.status
    });
  }
  get f() { return this.inviteUserForm.controls; }

  updateUser(user) {
    if (this.userForm.invalid) {
      this.sharedService.swalAlertMessage('Register', 'All fields are  required', 'info');
      return;
    }
    const body = {
      'firstName': this.userForm.value.firstName,
      'lastName': this.userForm.value.lastName,
      'email': this.userForm.value.email,
      'status': this.userForm.value.status,
      'address': this.userForm.value.address,
      'phone': this.userForm.value.phone,
    };
    this.spinner.show();
    this.userService.updateUser(this.viewUserModel.uniqueKey, body).subscribe(response => {
      this.spinner.hide();
      if (response.status === 200) {
        this.listOfUsers();
        swal({
          title: 'User Update',
          text: 'User successfully updated',
          type: 'info',
          confirmButtonText: 'Ok',
          customClass: 'sweet-alert',
          allowOutsideClick: false
        }).then(() => {
          this.whichForm = 'viewUserTable';
          // this.router.navigateByUrl('/users/view');
        });
      }
      //  this.router.navigateByUrl('/home');
    }, error => {
      this.handleErrors(error.error);
    });
  }
  back() {
    this.whichForm = 'viewUserTable';
  }
  displayInvitUserForm() {
    this.listOfRoles();
    // this.whichForm = 'inviteUserForm';
  }
  inviteUser(user) {
    this.submitted = true;
    if (this.inviteUserForm.invalid) {
      this.sharedService.swalAlertMessage('Create User', 'All fields are  required', 'info');
      return;
    }
    const requestBody = {
      'email': this.inviteUserForm.value.email,
      'roleId': this.inviteUserForm.value.roleId,
      'merchantId': this.sharedService.getMerchantId(),
      'redirectUrl': this.setPasswordLink,
    };
    this.spinner.show();
    this.userService.inviteUser(requestBody).subscribe(response => {
      this.spinner.hide();
      if (response.status === 'SUCCESS') {
                this.sharedService.swalAlertMessage('Create User',
              'Invite sent successfully to ' + this.inviteUserForm.value.email, 'success');
              $('#inviteUserForm').modal('toggle');
              this.inviteUserForm.reset();
        // this.sharedService.swalAlertMessage('Registration',
        //        'user invite successful, kindly check your email ( ' + this.inviteUserForm.value.email + ') to activate your account',
        //       'success');
        // const body = {
        //   'email': this.inviteUserForm.value.email,
        //   'redirectUrl': this.setPasswordLink,
        //   'requestType': 'RESET_PASSWORD',
        // };
        // this.userService.verifyEmail(body).subscribe(response1 => {
        //   if (response1.status === 'SUCCESS') {
        //     this.sharedService.swalAlertMessage('Invite',
        //       'user invite successful, kindly check your email ( ' + this.inviteUserForm.value.email + ') to activate your account',
        //       'success');
        //     $('#inviteUserForm').modal('toggle');
        //   }
        // }, error => {
        //   this.handleErrors(error.error);
        // });
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
  listOfRoles() {
    this.spinner.show();
    this.userService.listOfRoles().subscribe(response => {
      this.spinner.hide();
      this.categories = response.data.roles;
    }, error => {
      this.spinner.hide();
    });
  }
  resetPAssword(data) {
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
    this.spinner.show();
    this.userService.resetPassword(body).subscribe(response => {
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

  get g() { return this.resetPasswordForm.controls; }
}
