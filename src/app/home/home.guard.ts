import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HomeService } from './home.service';
import { SharedService } from '../service/shared.service';

@Injectable({
  providedIn: 'root'
})
export class HomeGuard implements CanActivate {
  constructor(private homeService: HomeService, private router: Router,
    private sharedService: SharedService) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const check = JSON.parse(this.sharedService.getCurrentUser());
    if (check !== null) {
      this.router.navigate(['/dashboard']);
      return false;
    }
    return true;
  }
}
