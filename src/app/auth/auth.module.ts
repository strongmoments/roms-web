import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AuthRoutingModule
  ],
  declarations: [LoginComponent, ChangePasswordComponent, ProfileComponent, ]
})
export class AuthModule { }
