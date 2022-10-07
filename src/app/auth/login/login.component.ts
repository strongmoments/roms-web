import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { AlertService } from 'src/app/core/services';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { Utils } from 'src/app/core/_helpers/util';
import { CustomMessage } from 'src/app/custom-message';
import { Globals } from 'src/app/globals';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  user!: any;
  passwordInputType: string = 'password';
  firstFormGroup: any;
  submitted = false;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private alertService: AlertService,
    private router: Router,
    public util: Utils,
    globals: Globals,
    private route: ActivatedRoute,
    private authService: AuthenticationService, private titleService: Title
  ) {
    
    this.titleService.setTitle('Login');
    this.user = this.authService.getCurrentUser();
    console.log(this.user, 'this.user')
    if (this.user) {
      // this.authService.logout();
      this.router.navigate(['/dashboard']);
    }
    this.firstFormGroup = this.formBuilder.group({
      username: new UntypedFormControl('', [
        Validators.required,
        // Validators.pattern(util.emailRegex),
        Validators.maxLength(256),
      ]),
      password: new UntypedFormControl('', [Validators.required]),
    });
  }

  ngOnInit() {

  }
  get t() {
    return this.firstFormGroup.controls;
  }
  public checkError = (controlName: string, errorName: string) => {
    return this.firstFormGroup.controls[controlName].hasError(errorName);
  };
  async onSubmit() {
    this.submitted = true;
    if (this.firstFormGroup.invalid) {
      this.alertService.openSnackBar('Fill the required fields');
      return;
    }
    var formData = this.firstFormGroup.value;

    this.authService
      .login(formData.username, formData.password, false)
      .pipe(first())
      .subscribe({
        next: (result: any) => {
          // this.alertService.openSnackBar(CustomMessage.loginSuccess, false);
          this.router.navigate(['/dashboard']);
        },
        error: (error: any) => {
          console.log(error, 'error')
          this.alertService.openSnackBar(CustomMessage.invalidCredential);
        },
      });
  }

  showHidePassword(type: string) {
    this.passwordInputType = type;

  }
}
