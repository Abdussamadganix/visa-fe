import { Injectable } from '@angular/core';
import { Constants } from '../constants';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { DataService } from '../service/data';
import { SharedService } from '../service/shared.service';
const ApiBaseUrl = Constants.API_ENDPOINT;

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  readonly usersApi = ApiBaseUrl + '/users';
  readonly merchantApi = ApiBaseUrl + '/merchants';
  readonly changePasswordApi = ApiBaseUrl + '/users/passwordchange';

  constructor(private dataService: DataService) { }

  getUser(uniqueKey) {
    return this.dataService.get(this.usersApi + '/' + uniqueKey)
      .pipe(map(this.extractData),
      catchError(this.handleError));
  }

  getMerchant(uniqueKey, pageNum = 0, pageSize = 10) {
    return this.dataService.get(this.merchantApi + '/' + uniqueKey + '?pageNumber=' + pageNum + '&pageSize=' + pageSize)
      .pipe(map(this.extractData),
      catchError(this.handleError));
  }
  changePassword(body) {
    return this.dataService.post(this.changePasswordApi, body)
      .pipe(map(this.extractData),
      catchError(this.handleError));
  }

  updateUser(uniqueKey, body) {
    return this.dataService.put(this.usersApi + '/' + uniqueKey, body)
      .pipe(map(this.extractData),
      catchError(this.handleError));
  }

  updateMerchant(uniqueKey, body) {
    return this.dataService.put(this.merchantApi + '/' + uniqueKey, body)
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
