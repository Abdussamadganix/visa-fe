import { Injectable } from '@angular/core';
import { Constants } from '../constants';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { DataService } from '../service/data';
const ApiBaseUrl = Constants.API_ENDPOINT;

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

 readonly transactionApi = ApiBaseUrl + '/merchants';

 constructor(private dataService: DataService) { }

 getTransactions(merchantKey, pageNum, pageSize, fromCreatedAt = '', toCreatedAt = '', all = false) {
   return this.dataService.get(this.transactionApi + '/' + merchantKey + '/payments?pageNumber=' + pageNum +
   '&pageSize=' + pageSize + '&fromCreatedAt=' + fromCreatedAt + '&toCreatedAt=' + toCreatedAt + '&all=' + all)
   .pipe(map(this.extractData),
   catchError(this.handleError));
 }

 downloadTransactions(merchantKey, queryParam = '',  paging = null) {
  if (paging !== null) {
    queryParam = queryParam + paging;
  } else {
    queryParam = queryParam;
  }
 // tslint:disable-next-line:max-line-length
 return this.dataService.get(this.transactionApi + '/' + merchantKey + '/payments' + queryParam)
 .pipe(map(this.extractData),
 catchError(this.handleError));
}

 searchTransactions(merchantKey, queryParam = '',  paging = null) {
   if (paging !== null) {
     queryParam = queryParam + paging;
   } else {
     queryParam = queryParam;
   }
  // tslint:disable-next-line:max-line-length
  return this.dataService.get(this.transactionApi + '/' + merchantKey + '/payments' + queryParam)
  .pipe(map(this.extractData),
  catchError(this.handleError));
}

searchTransactions1(merchantKey, queryParam = '', pageNum = 0, pageSize = 0 ) {
  // tslint:disable-next-line:max-line-length
  return this.dataService.get(this.transactionApi + '/' + merchantKey + '/payments' + queryParam +
   '&pageNumber=' + pageNum + '&pageSize=' + pageSize)
  .pipe(map(this.extractData),
  catchError(this.handleError));
}

 viewAllMerchant(pageNum, pageSize) {
  return this.dataService.get(this.transactionApi + '?pageNumber=' + pageNum + '&pageSize=' + pageSize)
  .pipe(map(this.extractData),
  catchError(this.handleError));
}

//  getTransactions(merchantKey) {
//   return this.dataService.get(this.transactionApi + merchantKey + '/payments')
//   .pipe(map(this.extractData),
//   catchError(this.handleError));
// }

getTransaction(merchantKey, paymentKey) {
 return this.dataService.get(this.transactionApi + '/' + merchantKey + '/payments/' + paymentKey)
 .pipe(map(this.extractData),
 catchError(this.handleError));
}


 getTransaction1() {
  return this.dataService.get(this.transactionApi)
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
