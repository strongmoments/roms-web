import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/core/services';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { Utils } from 'src/app/core/_helpers/util';
import { CustomMessage } from 'src/app/custom-message';
import { Globals } from 'src/app/globals';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  globals: Globals;
  submitted: boolean = false;
  form: FormGroup;
  inputTypes: any = [
    'password',
    'password',
    'password'
  ];
  constructor(public util: Utils, globals: Globals, private fb: FormBuilder, private alertService: AlertService, private router: Router, private authService: AuthenticationService) {
    this.globals = globals;
    this.form = this.fb.group({
      currentPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required, Validators.pattern(util.passwordRegex)]),
      confirmPassword: new FormControl('', [Validators.required]),
    }, {
      validator: this.ConfirmedValidator('newPassword', 'confirmPassword'),
    });
  }

  showHidePassword(index: number) {
    this.inputTypes[index] = this.inputTypes[index] == 'text' ? 'password' : 'text';
  }

  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors['confirmedValidator']
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }



  get f() {
    return this.form.controls;
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.form.controls[controlName].hasError(errorName);
  };


  ngOnInit(): void {
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      this.alertService.openSnackBar('Form invalid.');
      return;
    }

    let formValue = this.form.value;

    this.authService.changePassword({ oldPassword: formValue.currentPassword, newPassword: formValue.newPassword }).subscribe(
      (res: any) => {
        if (res.status == 'error' && res.error == 'old_password_does_not_match') {
          this.alertService.openSnackBar(CustomMessage.invalidCurrentPassword);
        } else {
          this.router.navigate(['/dashboard']);

        }
      },
      (error) => {
        this.alertService.openSnackBar(CustomMessage.error);
      },
    );
  }

}
