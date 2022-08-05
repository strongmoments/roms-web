import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { AlertService } from 'src/app/core/services';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { Utils } from 'src/app/core/_helpers/util';
import { Globals } from 'src/app/globals';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  firstFormGroup: any;
  submitted = false;
  constructor(private formBuilder: UntypedFormBuilder, private alertService: AlertService,
    private router: Router, public util: Utils, globals: Globals, private route: ActivatedRoute,
    private authService: AuthenticationService,) {

    this.firstFormGroup = this.formBuilder.group({
      email: new UntypedFormControl('', [Validators.required, Validators.pattern(util.emailRegex), Validators.maxLength(256)]),
      password: new UntypedFormControl('', [Validators.required]),
    });

  }

  ngOnInit() {
  }
  get t() { return this.firstFormGroup.controls; }
  public checkError = (controlName: string, errorName: string) => {
    return this.firstFormGroup.controls[controlName].hasError(errorName);
  }
  async onSubmit() {
    this.submitted = true;
    if (this.firstFormGroup.invalid) {
      this.alertService.openSnackBar('Fill the required fields');
      return;
    }
    var formData = this.firstFormGroup.value;


    this.authService.login(formData.email, formData.password, false).pipe(first()).subscribe({
      next: (result: any) => {
        this.router.navigate(['/']);
      },
      error: (error: any) => {
        this.alertService.openSnackBar(error);
      }
    })
  }
}
