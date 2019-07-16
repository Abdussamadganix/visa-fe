import { Injectable } from '@angular/core';
import { DataService } from '../service/data';
import { Constants } from '../constants';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
const ApiBaseUrl = Constants.API_ENDPOINT;

@Injectable({
  providedIn: 'root'
})
export class MerchantService {
  readonly merchantAPi = ApiBaseUrl + '/merchants';
  readonly bankApi = ApiBaseUrl + '/banks';

  constructor(private dataService: DataService,
    private http: HttpClient) { }

  viewAllMerchant(pageSize, pageNum) {
    return this.dataService.get(this.merchantAPi + `?pageSize=${pageSize}&pageNumber=${pageNum}`)
    .pipe(map(this.extractData),
    catchError(this.handleError));
  }

  downloadMerchants(queryParam = '',  paging = null) {
    if (paging !== null) {
      queryParam = queryParam + paging;
    } else {
      queryParam = queryParam;
    }
   // tslint:disable-next-line:max-line-length
   return this.dataService.get(this.merchantAPi + '/' + queryParam)
   .pipe(map(this.extractData),
   catchError(this.handleError));
  }

  searchMerchant(queryParam , paging) {
    if (paging) {
      queryParam = queryParam + paging;
    } else {
      queryParam = queryParam;
    }
    return this.dataService.get(this.merchantAPi + queryParam)
    .pipe(map(this.extractData),
    catchError(this.handleError));
  }

  viewSingleMerchant(merchantkey) {
    return this.dataService.get(this.merchantAPi + '/' + merchantkey)
    .pipe(map(this.extractData),
    catchError(this.handleError));
  }
  viewMerchantFile(uniqueKey) {
    return this.dataService.get(this.merchantAPi + '/attachment/' + uniqueKey)
    .pipe(map(this.extractData),
    catchError(this.handleError));
  }


  public async downloadFile(id: string): Promise<Blob> {
    const file = await this.http.get<Blob>(
      this.merchantAPi + '/attachment/' + id,
      { responseType: 'blob' as 'json' }).toPromise();
    return file;
  }

  updateMerchant(uniqueKey, body) {
    return this.dataService.put(this.merchantAPi + '/' + uniqueKey, body)
    .pipe(map(this.extractData),
    catchError(this.handleError));
  }

  viewAllBanks() {
  return this.dataService.get(this.bankApi + `?pageSize=1000`)
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
