import { Injectable } from '@angular/core';
import { DataService } from '../service/data';
import { Constants } from '../constants';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
const ApiBaseUrl = Constants.API_ENDPOINT;

@Injectable({
  providedIn: 'root'
})
export class PgSetupService {
  readonly pgSetupApi = ApiBaseUrl + '/providers';
  readonly transManagerApi = ApiBaseUrl + '/transaction/managers';
  readonly binApi = ApiBaseUrl + '/bin';

  constructor(private dataService: DataService) { }


  getAllProviders(pageSize, pageNum) {
    return this.dataService.get(this.pgSetupApi + `?pageSize=${pageSize}&pageNumber=${pageNum}`)
      .pipe(map(this.extractData),
        catchError(this.handleError));
  }
  addProvider(body) {
    return this.dataService.post(this.pgSetupApi, body)
      .pipe(map(this.extractData),
        catchError(this.handleError));
  }
  updateProvider(code, body) {
    return this.dataService.put(this.pgSetupApi + '/' + code, body)
      .pipe(map(this.extractData),
        catchError(this.handleError));
  }
  getAllTransManager(pageSize, pageNum) {
    return this.dataService.get(this.transManagerApi + `?pageSize=${pageSize}&pageNumber=${pageNum}`)
      .pipe(map(this.extractData),
        catchError(this.handleError));
  }
  updateTransManager(uniqueKey, body) {
    return this.dataService.put(this.transManagerApi + '/' + uniqueKey, body)
      .pipe(map(this.extractData),
        catchError(this.handleError));
  }
  addTransManager(body) {
    return this.dataService.post(this.transManagerApi, body)
      .pipe(map(this.extractData),
        catchError(this.handleError));
  }

  getAllBin() {
    return this.dataService.get(this.binApi)
      .pipe(map(this.extractData),
        catchError(this.handleError));
  }
  updateBin(body) {
    return this.dataService.put(this.binApi + '/update', body)
      .pipe(map(this.extractData),
        catchError(this.handleError));
  }
  addBin(body) {
    return this.dataService.post(this.binApi, body)
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
