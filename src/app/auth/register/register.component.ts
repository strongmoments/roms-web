import { Component, OnInit } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/core/services';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { Utils } from 'src/app/core/_helpers/util';
import { CustomMessage } from 'src/app/custom-message';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  submitted: boolean = false;
  stepper!: MatStepper;
  isLinear: boolean = true;
  firstFormGroup: UntypedFormGroup = Object.create(null);
  secondFormGroup: UntypedFormGroup = Object.create(null);
  isOptional = false;
  isEditable = false;

  // tslint:disable-next-line - Disables all
  constructor(private _formBuilder: UntypedFormBuilder, private utils: Utils, private alertService: AlertService, private authService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      // firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      empNo: new FormControl('', [Validators.required, Validators.pattern(this.utils.aplhaNumericeWithoutSpace), Validators.maxLength(15)]),
      firstName: new FormControl('', [Validators.required, Validators.maxLength(25)]),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(25)]),
      email: new FormControl('', [Validators.required, Validators.pattern(this.utils.emailRegex), Validators.maxLength(30)]),
      contactNo: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(this.utils.intRegex)]),
    });
  }


  get f() {
    return this.secondFormGroup.controls;
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.secondFormGroup.controls[controlName].hasError(errorName);
  };


  onSubmit(stepper: MatStepper) {
    this.submitted = true;
    if (this.secondFormGroup.invalid) {
      this.alertService.openSnackBar(CustomMessage.invalidForm);
      return;
    }

    let formValues = this.secondFormGroup.value;
    console.log(formValues)
    this.authService.register({
      employeeNo: formValues.empNo,
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      phone: formValues.contactNo,
      orgId: environment.orgId

    }).subscribe((result: any) => {
      if (result.status == "success") {
        // this.secondFormGroup.reset();
        stepper.next();
        this.submitted = false;
        this.alertService.openSnackBar(CustomMessage.registerSuccess, false);
      } else if (result.status == "errorsuccess" && result.error == "already_requested") {
        this.alertService.openSnackBar(CustomMessage.alreadyRegistered);
        this.router.navigate(['/']);
      } else if (result.status == "error" && result.error == "already_exist") {
        this.alertService.openSnackBar(CustomMessage.alreadyExist);
        this.router.navigate(['/']);
      }
      stepper.next();
    }, (error: any) => {
      this.alertService.openSnackBar(CustomMessage.error);
    });
  }

}
