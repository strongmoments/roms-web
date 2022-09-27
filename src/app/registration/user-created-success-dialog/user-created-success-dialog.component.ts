import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
    selector: 'app-user-created-success-dialog',
    templateUrl: './user-created-success-dialog.component.html',
    styleUrls: ['./user-created-success-dialog.component.scss']
})
export class UserCreatedSuccessDialogComponent {
    user: any = {};
    constructor(
        public dialogRef: MatDialogRef<UserCreatedSuccessDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, private router: Router,
    ) {
        if (data.data) {
            this.user = data.data;
        }

    }

    onNoClick(): void {
        this.router.navigate(['/registration/list']);
        this.dialogRef.close();
    }

    
  copyInputMessage(inputElement:any){
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }
}