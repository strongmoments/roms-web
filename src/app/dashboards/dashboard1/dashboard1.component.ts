import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewUserPrivacyPolicyDialog } from 'src/app/shared/new-user-privacy-policy-dialog/new-user-privacy-policy-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard1.component.html',
  styleUrls: ['./dashboard1.component.scss'],
})
export class Dashboard1Component implements OnInit {
  constructor(private dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.openPrivacyDialog();
  }
  openPrivacyDialog() {
    const dialogRef = this.dialog.open(NewUserPrivacyPolicyDialog, {
      width: '70em',
      height: '40em',
      // data: { data: data }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // this.router.navigate(['/registration/list']);
      // console.log('The dialog was closed');
    });
  }

}
