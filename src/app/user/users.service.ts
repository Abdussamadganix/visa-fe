import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { DataService } from '../service/data';
import { Constants } from '../constants';
const ApiBaseUrl = Constants.API_ENDPOINT;


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  readonly usersApi = ApiBaseUrl + '/users';
  readonly twoFALinkAPi = ApiBaseUrl + '/users/2fa/link';
  readonly inviteUserApi = ApiBaseUrl + '/users/invite';
  readonly getListOfRolesApi = ApiBaseUrl + '/roles';
  readonly resetPasswordApi = ApiBaseUrl + '/users/passwordreset';
  uniqueKey: any;

constructor(private dataService: DataService) { }

    listOfUsers(PageSize, PageNum) {
      return this.dataService.get(this .usersApi + `?pageSize=${PageSize}&pageNumber=${PageNum}`)
      .pipe(map(this.extractData),
      catchError(this.handleError));
    }
    listOfRoles() {
      return this.dataService.get(this .getListOfRolesApi)
      .pipe(map(this.extractData),
      catchError(this.handleError));
    }
    updateUser(uniqueKey, body) {
      return this.dataService.put(this.usersApi + '/' + uniqueKey, body)
      .pipe(map(this.extractData),
      catchError(this.handleError));
    }
    viewUser(uniqueKey, body) {
      return this.dataService.put(this.usersApi + '/' + uniqueKey, body)
      .pipe(map(this.extractData),
      catchError(this.handleError));
    }
    resetPassword(body) {
      return this.dataService.post(this.resetPasswordApi, body)
      .pipe(map(this.extractData),
      catchError(this.handleError));
    }
    verifyEmail(body) {
      return this.dataService.post(this.twoFALinkAPi, body)
      .pipe(map(this.extractData),
      catchError(this.handleError));
    }
    inviteUser(body) {
      return this.dataService.post(this.inviteUserApi, body)
      .pipe(map(this.extractData),
      catchError(this.handleError));
    }


    private handleError(error: Response | any) {
      return throwError(error);
    }
    private extractData(res: Response | any) {
      return res || [];
    }
}
