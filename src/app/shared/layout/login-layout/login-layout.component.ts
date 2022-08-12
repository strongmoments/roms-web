import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { Globals } from 'src/app/globals';

@Component({
  selector: 'app-login-layout',
  templateUrl: './login-layout.component.html',
  styleUrls: ['./login-layout.component.css']
})
export class LoginLayoutComponent implements OnInit {

  globals: Globals;
  constructor(globals: Globals, private router: Router, private authService: AuthenticationService,) {
    this.globals = globals;
  }

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user !== null && user !== undefined) {
      this.router.navigate(['/dashboard']);
    }
  }

}
