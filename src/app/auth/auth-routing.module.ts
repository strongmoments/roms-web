import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppBlankComponent } from '../layouts/blank/blank.component';
// import { LoginLayoutComponent } from '../shared/layout/login-layout/login-layout.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
    {
        path: '',
        component: AppBlankComponent,
        children: [
            { path: '', component: LoginComponent },

            //{ path: 'forgot-password', component: ForgotPasswordComponent },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
