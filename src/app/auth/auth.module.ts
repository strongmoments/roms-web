import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { PrivacyScreenComponent } from './privacy-screen/privacy-screen.component';
import { SupportScreenComponent } from './support-screen/support-screen.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AuthRoutingModule
  ],
  declarations: [LoginComponent, ChangePasswordComponent, ProfileComponent, RegisterComponent, PrivacyScreenComponent, SupportScreenComponent,]
})
export class AuthModule { }
