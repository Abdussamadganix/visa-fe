import { Injectable } from '@angular/core';
import { DataService } from '../service/data';
import { Constants } from '../constants';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
const ApiBaseUrl = Constants.API_ENDPOINT;

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  readonly roleApi = ApiBaseUrl + '/roles';
  readonly permissionApi = ApiBaseUrl + '/permissions';
  constructor(private dataService: DataService) { }
  viewAllRoles(pageSize, pageNum) {
    return this.dataService.get(this.roleApi  + `?pageSize=${pageSize}&pageNumber=${pageNum}`)
    .pipe(map(this.extractData),
    catchError(this.handleError));
  }

  updateRole(body, uniqueKe) {
    return this.dataService.put(this.roleApi + '/' + uniqueKe, body)
    .pipe(map(this.extractData),
    catchError(this.handleError));
  }

  addRole(body) {
    return this.dataService.post(this.roleApi, body)
    .pipe(map(this.extractData),
    catchError(this.handleError));
  }

  viewPermisions() {
    return this.dataService.get(this.permissionApi)
    .pipe(map(this.extractData),
    catchError(this.handleError));
  }

  viewAllRole(uniqueKey) {
    return this.dataService.get(this.roleApi + '/' + uniqueKey)
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
