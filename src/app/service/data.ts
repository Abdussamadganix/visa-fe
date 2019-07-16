import {Injectable} from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class DataService {

  entries: string[] = [];
  constructor(private http: HttpClient) {}

  get(url) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.get(url, {headers: headers})
    .pipe(catchError(this.handleError) );
  }

  post(url, body) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(url, body, {headers: headers})
    .pipe( catchError(this.handleError) );
  }

  put(url, body): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.put(url, body, {headers: headers, observe: 'response'})
    .pipe( catchError(this.handleError) );
  }

  fileUpload(url, body) {
    return this.http.post(url, body, { observe: 'response' }).pipe( catchError(this.handleError) );
  }


  delete(url) {
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    });
    return this.http.delete(url, {headers: headers, observe: 'response'} )
    .pipe( catchError(this.handleError) );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
