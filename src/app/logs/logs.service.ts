import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { DataService } from '../service/data';
import { Constants } from '../constants';
const ApiBaseUrl = Constants.API_ENDPOINT;

@Injectable({
  providedIn: 'root'
})
export class LogsService {

  readonly getLogAPi = ApiBaseUrl + '/payments'

  constructor(private dataService: DataService) { }
  viewLogs(body) {
    return this.dataService.get(this.getLogAPi)
    .pipe(map(this.extractData),
    catchError(this.handleError));
  }

getTransactions(pageNum, pageSize, fromCreatedAt = '', toCreatedAt = '') {
   return this.dataService.get(this.getLogAPi + '?pageNumber=' + pageNum +
   '&pageSize=' + pageSize + '&fromCreatedAt=' + fromCreatedAt + '&toCreatedAt=' + toCreatedAt)
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
