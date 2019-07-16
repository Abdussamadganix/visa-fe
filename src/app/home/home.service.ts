import { Injectable } from '@angular/core';
import { Constants } from '../constants';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { DataService } from '../service/data';
const ApiBaseUrl = Constants.API_ENDPOINT;

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  // readonly loginApi = ApiBaseUrl + '/login';
  readonly createUserApi = ApiBaseUrl + '/users';
  readonly authenticateUserApi = ApiBaseUrl + '/users/authenticate';
  readonly twoFALinkAPi = ApiBaseUrl + '/users/2fa/link';
  readonly confirmEmailApi = ApiBaseUrl + '/users/confirmemail';
  readonly resetPasswordApi = ApiBaseUrl + '/users/passwordreset';

  constructor(private dataService: DataService) { }


  // getToken(body) {
  //   return this.dataService.get(this.loginApi)
  //   .pipe(map(this.extractData),
  //   catchError(this.handleError));
  // }

  createUser(body) {
    return this.dataService.post(this.createUserApi, body)
    .pipe(map(this.extractData),
    catchError(this.handleError));
  }
  forgortPassword(body) {
    return this.dataService.post(this.twoFALinkAPi, body)
    .pipe(map(this.extractData),
    catchError(this.handleError));
  }
  resetPasword(body) {
    return this.dataService.post(this.resetPasswordApi, body)
    .pipe(map(this.extractData),
    catchError(this.handleError));
  }

  resetUser(body) {
    return this.dataService.post(this.twoFALinkAPi, body)
    .pipe(map(this.extractData),
    catchError(this.handleError));
  }
  authUser(body) {
    return this.dataService.post(this.authenticateUserApi, body)
    .pipe(map(this.extractData),
    catchError(this.handleError));
  }

  verifyEmail(body) {
    return this.dataService.post(this.twoFALinkAPi, body)
    .pipe(map(this.extractData),
    catchError(this.handleError));
  }
  confirmEmail(body) {
    return this.dataService.post(this.confirmEmailApi, body)
    .pipe(map(this.extractData),
    catchError(this.handleError));
  }

  setCredentials(data) {
     localStorage.setItem('xpdackuser', JSON.stringify(data));
  }

  isAuthenticated(): boolean {
    const login = localStorage.getItem('xpdackuser');

    if (login === null || login === undefined || login === '' ) {
      return false;
    }
    return true;
  }

  // getTokenPost(body) {
  //   return this.dataService.post(this.loginApi, body)
  //   .pipe(map(this.extractData),
  //   catchError(this.handleError));
  // }

  private handleError( error: Response | any) {
    return throwError(error);
  }

  private extractData(res: Response | any) {
    return res || [];
  }
}
