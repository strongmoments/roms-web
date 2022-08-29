import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar.component',
  templateUrl: './snackbar.component.component.html',
  styleUrls: ['./snackbar.component.component.css']
})
export class SnackbarComponent { 
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any,
              public snackBar: MatSnackBar) {
  }
}