import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import swal from 'sweetalert2';
import { SharedService } from '../service/shared.service';

@Injectable({
  providedIn: 'root'
})
export class PermisionsGuard implements CanActivate {
  constructor(public router: Router, private sharedService: SharedService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const expectedRole = route.data.expectedPermission;
    const role = this.sharedService.permissionMatch(expectedRole);
    const isRegistrationComplete = this.sharedService.getisRegistrationComplete();
    return true;
    // if (role === true && isRegistrationComplete === '0') {
    //   swal({
    //     title: 'Welcome!',
    //     text: 'Kindly complete your you registration...',
    //     type: 'info',
    //     confirmButtonText: 'Ok',
    //     customClass: 'login-alert',
    //     allowOutsideClick: false
    //   })
    //     .then(() => {
    //       this.router.navigateByUrl('/starter/business-information');
    //     });
    //   return true;
    // } else if (role === true && isRegistrationComplete === '1') {
    //   return true;
    // } else {
    //   swal({
    //     title: 'Access Denied!',
    //     text: 'You don\'t have access to this resource...',
    //     type: 'info',
    //     confirmButtonText: 'Ok',
    //     customClass: 'login-alert',
    //     allowOutsideClick: false
    //   })
    //     .then(() => {
    //       this.router.navigateByUrl('/dashboard');
    //     });
    //   return false;
    // }
  }
}
