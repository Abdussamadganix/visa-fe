import { Injectable } from '@angular/core';
// import { ErrorDialogService } from '../error-dialog/errordialog.service';
import { HttpInterceptor, HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SharedService } from '../service/shared.service';
import { HomeService } from '../home/home.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
        private sharedService: SharedService,
        private homeService: HomeService,
        public toastr: ToastrManager
        // public errorDialogService: ErrorDialogService
    ) { }

    showWarning() {
        this.toastr.warningToastr('This is warning toast.', 'Alert!');
    }
    showError() {
        this.toastr.errorToastr('Check your internet Connection.', 'Oops!');
    }

    showSuccess() {
        this.toastr.successToastr('This is success toast.', 'Success!');
    }

    showInfo() {
        this.toastr.infoToastr('This is info toast.', 'Info');
    }

    showCustom() {
        this.toastr.customToastr(
        '<span style=\'color: green; font-size: 16px; text-align: center;\'>Custom Toast</span>',
        null,
        { enableHTML: true }
        );
    }

    showToast(position: any = 'top-left') {
        this.toastr.infoToastr('This is a toast.', 'Toast', {
            position: position
        });
    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const user = JSON.parse(localStorage.getItem('xpdackuser'));
        if (user === null) {

        }
        if (user !== null) {
            request = request.clone({ headers: request.headers.set('X-User-Token', user.auth.token) });
        }

        // if (!request.headers.has('Content-Type')) {
        //     request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        // }
        // request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    // console.log('event--->>>', event);
                    // this.errorDialogService.openDialog(event);
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401 && (user !== null || user !== undefined)
                // tslint:disable-next-line:max-line-length
                || (error.error.error === 'AUTHENTICATION' && error.error.status === 'FAILED' && error.error.message === 'User not authenticated')) {
                    swal({
                        title: 'Session expire',
                        text: 'Please enter your password',
                        input: 'password',
                        confirmButtonText: 'Continue',
                        showCancelButton: true,
                        cancelButtonText: 'Logout',
                        allowOutsideClick: false
                    }).then((password) => {
                        if (password.value) {
                            const requestBody = {
                                email: this.sharedService.getEmail(),
                                password: password.value,
                            };
                            this.homeService.authUser(requestBody).subscribe(response => {
                                if (response.status === 'SUCCESS') {
                                    localStorage.removeItem('xpdackuser');
                                    this.homeService.setCredentials(response.data);
                                    const url = this.router.url;
                                    // this.router.navigateByUrl(url);
                                    // this.router.navigateByUrl('dashboard');
                                    location.reload();
                                }
                            });

                        } else {
                            this.sharedService.logout();
                            this.router.navigateByUrl('home');
                        }
                    });
                }
                if (error.statusText === 'Unknown Error' && error.status === 0) {
                    this.showError();
                }
                return throwError(error);
            }));
    }
}
