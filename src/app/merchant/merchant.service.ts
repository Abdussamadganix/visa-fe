import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { DataService } from '../service/data';
import { Constants } from '../constants';
const ApiBaseUrl = Constants.API_ENDPOINT;

@Injectable({
  providedIn: 'root'
})
export class MerchantService {
  readonly createMerchantAPi = ApiBaseUrl + '/alias/merchants/create';
  readonly getMerchantAPi = ApiBaseUrl + '/alias/merchants/get'
  readonly updateMerchantAPi = ApiBaseUrl + '/alias/merchants/update'
  readonly deleteMerchantAPi = ApiBaseUrl + '/alias/merchants/delete'

  constructor(private dataService: DataService) { }

  createMerchant(body) {
    return this.dataService.post(this.createMerchantAPi, body)
    .pipe(map(this.extractData),
    catchError(this.handleError));
  }
  viewMerchant(body) {
    return this.dataService.post(this.getMerchantAPi, body)
    .pipe(map(this.extractData),
    catchError(this.handleError));
  }

  updateMerchant(body) {
    return this.dataService.post(this.updateMerchantAPi, body)
    .pipe(map(this.extractData),
    catchError(this.handleError));
  }

  deleteMerchant(body) {
    return this.dataService.post(this.deleteMerchantAPi, body)
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
