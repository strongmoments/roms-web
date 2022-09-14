import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/_helpers';
import { AppBlankComponent } from '../layouts/blank/blank.component';
import { FullComponent } from '../layouts/full/full.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
// import { LoginLayoutComponent } from '../shared/layout/login-layout/login-layout.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: AppBlankComponent,
    // pathMatch:'full',
    children: [
      { path: '', component: LoginComponent },
      //{ path: 'forgot-password', component: ForgotPasswordComponent },
    ],
  },
  {
    path: '',
    component: FullComponent,
    canActivate: [AuthGuard],
    // pathMatch:'full',
    children: [
      { path: 'change-password', component: ChangePasswordComponent },
      { path: 'profile', component: ProfileComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
