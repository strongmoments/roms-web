import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/core/services';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { Utils } from 'src/app/core/_helpers/util';
import { CustomMessage } from 'src/app/custom-message';
import { environment } from 'src/environments/environment';
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
  departments: any = [];
  roles: any = [];
  managers: any = [];
  employeeType: any = [];
  constructor(private dialog: MatDialog, private activatedRoute: ActivatedRoute, private router: Router, private fb: FormBuilder, private utils: Utils, private alertService: AlertService, private authService: AuthenticationService) {

    this.activatedRoute.queryParams.subscribe((
      params: any) => {
      console.log('queryParams', params['requestId'])
      this.requestId = params['requestId'] || '';
      if (this.requestId == '') {
        this.router.navigate(['/registration/list'])
      }
    });




    this.authService.getAllEmployeeType().subscribe((result: any) => {
      this.employeeType = result && result.data && result.data.length > 0 ? result.data : [];
    });

    this.authService.getAllDepartmentType().subscribe((result: any) => {
      this.departments = result && result.data && result.data.length > 0 ? result.data : [];
    });

    this.authService.getAllManagers().subscribe((result: any) => {
      this.managers = result && result.data && result.data.length > 0 ? result.data : [];
    });

    this.authService.getAllRoles().subscribe((result: any) => {
      this.roles = result && result.data && result.data.length > 0 ? result.data : [];
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
      employeeNo: new FormControl(this.userSessionData?.employeeNo, [Validators.required, Validators.pattern(this.utils.intRegex), Validators.maxLength(15)]),
      firstName: new FormControl(this.userSessionData?.firstName, [Validators.required, Validators.maxLength(25)]),
      lastName: new FormControl(this.userSessionData?.lastName, [Validators.required, Validators.maxLength(25)]),
      email: new FormControl(this.userSessionData?.email, [Validators.required, Validators.pattern(this.utils.emailRegex), Validators.maxLength(30)]),
      contactNo: new FormControl(this.userSessionData?.phone, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(this.utils.intRegex)]),
      dob: new FormControl('', [Validators.required]),
      isManager: new FormControl(false),
      roleId: new FormControl('', [Validators.required]),
      managerId: new FormControl('', [Validators.required]),
      employTypeId: new FormControl('', [Validators.required]),
      departmentId: new FormControl('', [Validators.required])
    });
    console.log(this.userSessionData, 'this.userSessionData')
  }


  get f() {
    return this.form.controls;
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.form.controls[controlName].hasError(errorName);
  };




  openDialog(data: any) {
    const dialogRef = this.dialog.open(UserCreatedSuccessDialogComponent, {
      width: '250px',
      data: data,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('The dialog was closed');
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      this.alertService.openSnackBar(CustomMessage.invalidForm);
      return;
    }

    let formValues = this.form.value;
    console.log(formValues)
    formValues['orgId'] = environment.orgId;
    formValues['roleName'] = '';
    formValues['employType'] = '';
    formValues['gender'] = '';
    this.authService.createUser(formValues).subscribe((result: any) => {
      if (result.status == "success") {
        this.submitted = false;
        this.alertService.openSnackBar(CustomMessage.userCreatedSuccess, false);
        this.openDialog(result.data);
      } else if (result.status == "error" && result.error == "already_exist") {
        this.alertService.openSnackBar(CustomMessage.alreadyExist, false);
        this.router.navigate(['/registration/list']);
      }
    }, (error: any) => {
      this.alertService.openSnackBar(CustomMessage.error);
    });
  }

}
