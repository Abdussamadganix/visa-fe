import { Injectable } from '@angular/core';
import { Observable, } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Constants } from '../constants';
import { DataService } from './data';
const baseURl = Constants.API_ENDPOINT;
const docUrl = Constants.DOCS;

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  readonly enableDisableApi = baseURl;
  readonly approveRejectApi = baseURl;
  readonly logOutApi = baseURl + '/users/logout';
  loggedIn: any;
  public docsUrl = docUrl;
  constructor(private dataService: DataService) { }
  logout() {
    localStorage.clear();
    return this.dataService.post(this.logOutApi, {})
      .pipe(map(this.extractData),
        catchError(this.handleError));
  }

  getCurrentUser() {
    return localStorage.getItem('xpdackuser');
  }

  private clearCredentials() {
    localStorage.clear();
  }

  getUserUniqueId() {
    const user = JSON.parse(localStorage.getItem('xpdackuser'));
    return user.user.uniqueKey;
  }


  getToken() {
    const user = JSON.parse(localStorage.getItem('xpdackuser'));
    return user.auth.token;
  }

  getTokenExpiry() {
    const user = JSON.parse(localStorage.getItem('xpdackuser'));
    return user.auth.expires;
  }

  getLastName() {
    const user = JSON.parse(localStorage.getItem('xpdackuser'));
    return user.user.lastName;
  }

  getBusinessType() {
    const user = JSON.parse(localStorage.getItem('xpdackuser'));
    return user.user.businessType;
  }

  getisRegistrationComplete() {
    const user = localStorage.getItem('isRegistrationComplete');
    return user;
  }

  getUser() {
    const user = JSON.parse(localStorage.getItem('xpdackuser'));
    return user.user;
  }

  permissionMatch(allowedRoles): boolean {
    let isMatch = false;
    const user = JSON.parse(localStorage.getItem('xpdackuser'));
    const userPersmision  =  user.permission;
    allowedRoles.forEach(element => {
      if (userPersmision.indexOf(element) !==  -1) {
        isMatch = true;
        return isMatch;
      }
    });
    return isMatch;
  }


  getRegistrationComplete() {
    localStorage.getItem('reg-completed');
  }


  getFirstName() {
    const user = JSON.parse(localStorage.getItem('xpdackuser'));
    return user.user.firstName;
  }


  getIsMainMerchant() {
    const user = JSON.parse(localStorage.getItem('xpdackuser'));
    return user.user.isMainMerchant;
  }

  getFullName() {
    const user = JSON.parse(localStorage.getItem('xpdackuser'));
    const fName = (user.user.firstName !== null) ? user.user.firstName : '';
    const lName = (user.user.lastName !== null) ? user.user.lastName : '';
    return fName + ' ' + lName;
  }

  getMerchantId() {
    const user = JSON.parse(localStorage.getItem('xpdackuser'));
    return user.user.merchantId;
  }

  getUserPermistions() {
    const user = JSON.parse(localStorage.getItem('xpdackuser'));
    return user.permission;
  }

  getEmail() {
    const user = JSON.parse(localStorage.getItem('xpdackuser'));
    return user.user.email;
  }

  lastLogin() {
    const user = JSON.parse(localStorage.getItem('xpdackuser'));
    return user.user.lastLoginDate;
  }

  private handleError(error: Response | any) {
    return Observable.throw(error);
  }

  private extractData(res) {
    return res || [];
  }

  swalAlertMessage(title, text, type) {
    swal({
      title: title,
      text: text,
      type: type,
      confirmButtonText: 'Ok',
      customClass: 'sweet-alert',
      allowOutsideClick: false
    });
  }
}
