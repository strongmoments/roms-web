import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { first } from 'rxjs';
import { AdminService, AlertService } from 'src/app/core/services';
import { Utils } from 'src/app/core/_helpers/util';
import { Globals } from 'src/app/globals';
import { Company, UserAuth } from 'src/app/_models';


@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html'
})
export class UserDetailComponent implements OnInit {
  public event: EventEmitter<any> = new EventEmitter();
  submitted = false;
  addFormGroup!: UntypedFormGroup;
  globals!: Globals;
  title: string = '';
  user: UserAuth;
  isEdit: boolean = false;
  companyList: Company[] = [];
  constructor(private formBuilder: UntypedFormBuilder, globals: Globals, public dialogRef: MatDialogRef<UserDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public util: Utils, public adminService: AdminService,
    private alertService: AlertService,) {
    this.globals = globals;
    this.user = new UserAuth({ fullName: '', email: '', comapnyId: '', role: [], active: false });
    if (data.userData === undefined || data.userData === null) {
      this.title = 'Add User'
    }
    else {
      this.user = data.userData;
      this.title = 'Update User';
      this.isEdit = true;
    }
    if (data.companyList !== null && data.companyList !== undefined) {
      this.companyList = data.companyList;
    }

    console.log("this.user", this.user)

    this.addFormGroup = this.formBuilder.group({
      fullName: new UntypedFormControl(this.user.fullName, [Validators.required, Validators.maxLength(250)]),
      email: new UntypedFormControl(this.user.email, [Validators.required, Validators.email]),
      companyId: new UntypedFormControl(this.user.companyId),
      password: new UntypedFormControl(this.user.password, this.isEdit ? [Validators.pattern(this.util.passwordRegex)] :
        [Validators.required, Validators.pattern(this.util.passwordRegex)]),
      role: new UntypedFormControl(this.user.role![0], [Validators.required]),
      active: new UntypedFormControl(this.user.active, [Validators.required]),
      isChangePasswrod: new UntypedFormControl(false),
    });
  }

  ngOnInit() {

  }

  get f() { return this.addFormGroup.controls; }

  public checkError = (controlName: string, errorName: string) => {
    return this.addFormGroup.controls[controlName].hasError(errorName);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async onSubmit() {
    this.submitted = true;
    console.log(this.addFormGroup)
    if (this.addFormGroup.invalid) {
      this.alertService.openSnackBar('Fill the required fields');
      return;
    }
    const data = this.addFormGroup.value;

    Object.assign(this.user, data);

    console.log(this.user);


    this.adminService.userSave(this.user).pipe(first()).subscribe((obj: any) => {
      this.alertService.openSnackBar(obj.message, !obj.success);
      if (obj.success) {
        this.event.emit({ data: obj.data, status: true });
        this.dialogRef.close();
      }
    }, error => {
      console.log(error)
      this.alertService.openSnackBar(error);
    });
  }
}
