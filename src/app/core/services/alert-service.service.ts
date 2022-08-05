import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/shared/snackbar.component/snackbar.component.component';
 
@Injectable({
    providedIn: 'root'
})
export class AlertService {

    constructor(private snackBar: MatSnackBar) { }

    public openSnackBar(message: string, isError: boolean = true, time: number = 5000, title: string = '') {


        this.snackBar.openFromComponent(SnackbarComponent, {
            data: {
                html: (title === '' ?
                   `<p class="toastr-message">${message}</p>` :
                    `<h4 class="pop-error-title">${title}</h4><p>${message}</p>`)
            },
            panelClass: (isError ? 'snackbarError' : 'snackbarSuccess'),
            duration: time,
            verticalPosition: 'top',
            horizontalPosition: 'right',
        });

    }
}
