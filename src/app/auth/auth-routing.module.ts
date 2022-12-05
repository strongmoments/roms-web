import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/_helpers';
import { AppBlankComponent } from '../layouts/blank/blank.component';
import { FullComponent } from '../layouts/full/full.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
// import { LoginLayoutComponent } from '../shared/layout/login-layout/login-layout.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { PrivacyScreenComponent } from './privacy-screen/privacy-screen.component';
import { SupportScreenComponent } from './support-screen/support-screen.component';

const routes: Routes = [
  {
    path: '',
    component: AppBlankComponent,
    // pathMatch:'full',
    children: [
      { path: '', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'privacy', component: PrivacyScreenComponent },
      { path: 'support', component: SupportScreenComponent },
      //{ path: 'forgot-password', component: ForgotPasswordComponent },
    ],
  },
  {
    path: '',
    component: FullComponent,
    canActivate: [AuthGuard],
    // pathMatch:'full',
    children: [
      {
        path: 'change-password', component: ChangePasswordComponent,
        data: {
          title: 'Change Password',
          urls: [{ title: 'Home', url: '/' }, { title: 'Change Password' }],
        }
      },
      { path: 'profile', component: ProfileComponent,
      data: {
        title: 'Profile',
        urls: [{ title: 'Home', url: '/' }, { title: 'Profile' }],
      } },
     
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule { }
