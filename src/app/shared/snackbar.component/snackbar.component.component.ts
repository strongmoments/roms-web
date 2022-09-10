import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/core/services';

@Component({
  selector: 'app-snackbar.component',
  templateUrl: './snackbar.component.component.html',
  styleUrls: ['./snackbar.component.component.css']
})
export class SnackbarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any,
    public snackBar: MatSnackBar, private router: Router, private notificationService: NotificationService) {
  }

  redirect() {
    // console.log(url, 'url')
    if (this.data && this.data.url) {
      if (this.data.params && this.data.params.id) {
        this.notificationService.markAsRead(this.data.params.id).subscribe();
      }
      this.router.navigate([this.data.url], { queryParams: this.data.params });
      this.snackBar.dismiss();
    }

  }
}