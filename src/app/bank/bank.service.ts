import { Injectable } from '@angular/core';
import { DataService } from '../service/data';
import { Constants } from '../constants';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
const ApiBaseUrl = Constants.API_ENDPOINT;

@Injectable({
  providedIn: 'root'
})
export class BankService {

  readonly bankApi = ApiBaseUrl + '/banks';
  readonly merchantApi = ApiBaseUrl + '/merchants';
  constructor(private dataService: DataService) { }

  viewAllBanks(merchantKey, pageSize, pageNum) {
    return this.dataService.get(this.bankApi + '?merchantKey=' + merchantKey)
      .pipe(map(this.extractData),
        catchError(this.handleError));
  }


  viewAllMerchant(pageSize = 10, pageNum = 0) {
    return this.dataService.get(this.merchantApi + '?pageNumber=' + pageNum + '&pageSize=' + pageSize)
      .pipe(map(this.extractData),
        catchError(this.handleError));
  }

  viewAllBank(bankCode) {
    return this.dataService.get(this.bankApi + '/' + bankCode)
      .pipe(map(this.extractData),
        catchError(this.handleError));
  }
  updateBank(bankCode, body) {
    return this.dataService.put(this.bankApi + '/' + bankCode, body)
      .pipe(map(this.extractData),
        catchError(this.handleError));
  }
  addBank(body) {
    return this.dataService.post(this.bankApi, body)
      .pipe(map(this.extractData),
        catchError(this.handleError));
  }
  viewBank(bankCode, body) {
    return this.dataService.put(this.bankApi + '/' + bankCode, body)
      .pipe(map(this.extractData),
        catchError(this.handleError));
  }
  private extractData(res: Response | any) {
    return res || [];
  }
  private handleError(error: Response | any) {
    return throwError(error);
  }
}
