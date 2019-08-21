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
  readonly createMerchantAPi = ApiBaseUrl + '/merchantalias/create';
  readonly getMerchantAPi = ApiBaseUrl + '/merchantalias/get'
  readonly updateMerchantAPi = ApiBaseUrl + '/merchantalias/update'
  readonly deleteMerchantAPi = ApiBaseUrl + '/merchantalias/delete'
  readonly fetchMerchantAPi = ApiBaseUrl + '/merchantalias'

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

  viewAllMerchant(pageSize, pageNum) {
    return this.dataService.get(this.fetchMerchantAPi + `?pageSize=${pageSize}&pageNumber=${pageNum}`)
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
