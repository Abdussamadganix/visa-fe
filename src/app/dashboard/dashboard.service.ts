import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { DataService } from '../service/data';
import { Constants } from '../constants';
const ApiBaseUrl = Constants.API_ENDPOINT;

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  readonly getTransactions = ApiBaseUrl + '/merchants/';
  readonly  getTransactionsDaily = ApiBaseUrl + '/analytics/merchants/';

  uniqueKey: any;
  constructor(private dataService: DataService) { }
  getTransactionSummary(merchantKey) {
    return this.dataService.get(this.getTransactions + merchantKey + '/payments/summary')
    .pipe(map(this.extractData),
      catchError(this.handleError));
  }
  getTransactionAmountSummary(merchantKey) {
    return this.dataService.get(this.getTransactions + merchantKey + '/payments/amounts/summary')
    .pipe(map(this.extractData),
      catchError(this.handleError));
  }
  getDailyTransactions(merchantKey) {
    return this.dataService.get(this.getTransactionsDaily + merchantKey + '/cashflow')
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
