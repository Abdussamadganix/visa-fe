import { Injectable } from '@angular/core';
import { DataService } from '../service/data';
import { Constants } from '../constants';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
const ApiBaseUrl = Constants.API_ENDPOINT;

@Injectable({
  providedIn: 'root'
})
export class StarterService {
  readonly starterApi = ApiBaseUrl + '/merchants/attachment';
  readonly nameEnquiryApi = ApiBaseUrl + '/banks/nameenquiry';

  constructor(private dataService: DataService) { }

  uploadFile(body) {
    return this.dataService.fileUpload(this.starterApi, body)
    .pipe(map(this.extractData),
    catchError(this.handleError));
  }
  nameEnquiry(body) {
    return this.dataService.post(this.nameEnquiryApi, body)
    .pipe(map(this.extractData),
    catchError(this.handleError));
  }
  private handleError( error: Response | any) {
    return throwError(error);
  }
  private extractData(res: Response | any) {
    return res || [];
  }
}
