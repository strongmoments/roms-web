import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from 'src/app/core/_helpers/util';
import { UserCreatedSuccessDialogComponent } from '../user-created-success-dialog/user-created-success-dialog.component';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

  requestId: any = '';
  userSessionData: any = {};
  form!: FormGroup;
  submitted: boolean = false;

  constructor(private dialog: MatDialog, private activatedRoute: ActivatedRoute, private router: Router, private fb: FormBuilder, private utils: Utils) {

    this.activatedRoute.queryParams.subscribe((
      params: any) => {
      console.log('queryParams', params['requestId'])
      this.requestId = params['requestId'] || '';
      if (this.requestId == '') {
        this.router.navigate(['/registration/list'])
      }
    });

  }

  ngOnInit(): void {
    let data = sessionStorage.getItem(this.requestId);
    if (data) {
      this.userSessionData = JSON.parse(data);
    } else {
      this.router.navigate(['/registration/list'])
    }
    this.form = this.fb.group({
      empNo: new FormControl(this.userSessionData?.employeeNo, [Validators.required, Validators.pattern(this.utils.intRegex), Validators.maxLength(15)]),
      firstName: new FormControl(this.userSessionData?.firstName, [Validators.required, Validators.maxLength(25)]),
      lastName: new FormControl(this.userSessionData?.lastName, [Validators.required, Validators.maxLength(25)]),
      email: new FormControl(this.userSessionData?.email, [Validators.required, Validators.pattern(this.utils.emailRegex), Validators.maxLength(30)]),
      contactNo: new FormControl(this.userSessionData?.phone, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(this.utils.intRegex)]),

    });
    console.log(this.userSessionData, 'this.userSessionData')
  }


  openDialog() {
    const dialogRef = this.dialog.open(UserCreatedSuccessDialogComponent, {
      width: '250px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('The dialog was closed');
    });
  }
}
