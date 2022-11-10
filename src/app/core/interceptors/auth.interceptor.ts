import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { HttpEvent } from '@angular/common/http';
import { tap } from 'rxjs/operators';

import { AuthenticationService } from '../services/auth.service';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthenticationService, private router: Router) { }


    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const user = this.authService.getCurrentUser();
        if (user && user.token) {
            // const cloned = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + user.token) });
            console.log(req, 'asa')
            let contentType: any = { 'Authorization': 'Bearer ' + user.token };
            let responseType = '';
            // if (req.url.includes('/v1/files')) {
            //     contentType['Accept'] = 'application/octet-stream';
            //     contentType['Content-Type'] = 'application/octet-stream';
            //     responseType = 'blob';

            //     // : "application/octet-stream"
            // } else {

            if (req.body instanceof FormData) {
                // we are sending a file here
                // contentType = 'multipart/form-data';
            } else {
                contentType['Content-Type'] = 'application/json';
            }
            // }
            // console.log(contentType);
            // if (req.headers.has('Content-Type') && req.headers.get('Content-Type') == 'multipart/form-data') {
            //     req.headers.delete('Content-Type');
            // } else {
            //     contentType['Content-Type'] = 'application/json'
            // }

            // console.log(req.headers,contentType);
            let cloned: any;
            // if (responseType) {
            //     if (responseType == 'blob') {
            //         cloned = req.clone({ setHeaders: contentType, responseType: 'blob' });
            //     }
            // } else {
            cloned = req.clone({ setHeaders: contentType });

            // }
            return next.handle(cloned).pipe(tap(() => { }, (err: any) => {

                if (err instanceof HttpErrorResponse) {
                    if (err.status === 401 || err.status === 403) {
                        // if (err.status === 401 || err.status === 0) {
                        this.authService.logout();
                        this.router.navigate(['/']);
                    }
                }
            }));

        } else {
            return next.handle(req);
        }
    }
}
