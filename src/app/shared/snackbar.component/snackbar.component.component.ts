import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-snackbar.component',
  templateUrl: './snackbar.component.component.html',
  styleUrls: ['./snackbar.component.component.css']
})
export class SnackbarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any,
    public snackBar: MatSnackBar, private router: Router) {
  }

  redirect() {
    // console.log(url, 'url')
    if(this.data && this.data.url){
      this.router.navigate([this.data.url]);
    }
    
  }
}