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
  styleUrls: ['./create-user.component.scss'],
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
        this.router.navigate(['/registration/list']);
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
      this.router.navigate(['/registration/list']);
    }
    this.form = this.fb.group({
      employeeNo: new FormControl(this.userSessionData?.employeeNo, [Validators.required, Validators.pattern(this.utils.aplhaNumericeWithoutSpace), Validators.maxLength(15)]),
      firstName: new FormControl(this.userSessionData?.firstName, [Validators.required, Validators.maxLength(25)]),
      lastName: new FormControl(this.userSessionData?.lastName, [Validators.required, Validators.maxLength(25)]),
      email: new FormControl(this.userSessionData?.email, [Validators.required, Validators.pattern(this.utils.emailRegex), Validators.maxLength(30)]),
      contactNo: new FormControl(this.userSessionData?.phone, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(this.utils.intRegex)]),
      // dob: new FormControl('', [Validators.required]),
      isManager: new FormControl(false),
      roleId: new FormControl('', [Validators.required]),
      managerId: new FormControl('', []),
      employTypeId: new FormControl('', [Validators.required]),
      departmentId: new FormControl('', [Validators.required]),
      notifyBySms: new FormControl(false, []),
    });
    // console.log(this.userSessionData, 'this.userSessionData');
  }


  get f() {
    return this.form.controls;
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.form.controls[controlName].hasError(errorName);
  };




  openDialog(data: any) {
    const dialogRef = this.dialog.open(UserCreatedSuccessDialogComponent, {
      width: '40em',
      height: '34em',
      data: { data: data }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.router.navigate(['/registration/list']);
      console.log('The dialog was closed');
    });
  }


  onSubmit() {
    this.submitted = true;
    // console.log(this.form.value.roleId, 'this.form.value');
    if (this.form.invalid) {
      this.alertService.openSnackBar(CustomMessage.invalidForm);
      return;
    }

    let formValues = this.form.value;
    let roleName = formValues.roleId;
    let departmentName = formValues.departmentId;
    let role = this.roles.find((elem: any) => elem.name.toLowerCase() == formValues.roleId.trim().toLowerCase());
    formValues['roleName'] = role ? '' : formValues.roleId;
    formValues['roleId'] = role ? role.id : '';
    let department = this.departments.find((elem: any) => elem.description.toLowerCase() == formValues.departmentId.trim().toLowerCase());
    formValues['departmentName'] = department ? '' : formValues.departmentId;
    formValues['departmentId'] = department ? department.id : '';

    let employeeType = this.employeeType.find((elem: any) => elem.name.toLowerCase() == formValues.employTypeId.trim().toLowerCase());
    formValues['employType'] = employeeType ? '' : formValues.employTypeId;
    formValues['employTypeId'] = employeeType ? employeeType.id : '';

    formValues['orgId'] = environment.orgId;
    formValues['gender'] = '';
    console.log(formValues)
    this.authService.createUser(formValues).subscribe((result: any) => {
      if (result.status == "success") {
        this.submitted = false;
        this.alertService.openSnackBar(CustomMessage.userCreatedSuccess, false);
        let data: any = result;
        console.log(data, 'data', result);
        data['roleName'] = roleName;
        data['departmentName'] = departmentName;
        this.openDialog(data);
        this.form.reset();
        sessionStorage.removeItem(this.requestId);
      } else if (result.status == "error" && result.error == "already_exist") {
        sessionStorage.removeItem(this.requestId);
        this.alertService.openSnackBar(CustomMessage.alreadyExist);
        this.router.navigate(['/registration/list']);
      }
    }, (error: any) => {
      this.alertService.openSnackBar(CustomMessage.error);
    });
  }

}
