import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SnackbarComponent } from 'src/app/shared/snackbar.component/snackbar.component.component';

@Injectable({
    providedIn: 'root'
})
export class AlertService {

    constructor(private snackBar: MatSnackBar, private router: Router,private sanitized:DomSanitizer) { }

    public openSnackBar(message: string, isError: boolean = true, time: number = 5000, title: string = '', isLinkNotitication: boolean = false, data: any = {}) {
        let notificationHtml:any = '';
        if (isLinkNotitication) {
            notificationHtml =
            this.sanitized.bypassSecurityTrustHtml(  `<img onerror="this.onerror=null;this.src='../../assets/img/user-default-img.jpg';" src='${data?.profileImage}' 
                class="img-circle" style="border-radius:12px;max-height:30px;max-width:32px;" height="28px" width="29px" align="left"><p class="toastr-message">${message}</p>`);

            // <div fxLayout="row wrap" fxFlexAlign="center" class="row">
            // <span href="javascript:void(0);"><img [src]='${data?.profileImage}' 
            //  class="profile-pic" align="left">
            // <div class="row">
            // <h5 class="pop-error-title">${title}<small><br>${message}</small></h5></div></div>
        } else {
            notificationHtml = title === '' ?
                `<p class="toastr-message">${message}</p>` :
                `<h5 class="pop-error-title">${title}<small><br>${message}</small></h5>`
        }
console.log(notificationHtml,'notificationHtml')
        this.snackBar.openFromComponent(SnackbarComponent, {
            data: {
                html: notificationHtml,
                url: isLinkNotitication ? data.url : '',
                params: isLinkNotitication ? { id: data.eventId } : {}
            },
            panelClass: (isError ? 'snackbarError' : 'snackbarSuccess'),
            duration: time,
            verticalPosition: 'top',
            horizontalPosition: 'right',
        });

    }

}
