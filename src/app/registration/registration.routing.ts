import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FullComponent } from '../layouts/full/full.component';
import { RegistrationListComponent } from '../registration/registration-list/registration-list.component';
import { CreateUserComponent } from '../registration/create-user/create-user.component';
import { RecruitmentComponent } from './recruitment/recruitment.component';

const routes: Routes = [
    {
        path: '',
        component: FullComponent,
        // pathMatch: 'full',
        children: [
            { path: 'list', component: RegistrationListComponent },
            { path: 'create-user', component: CreateUserComponent },
            { path: 'recruitment', component: RecruitmentComponent },
            //   { path: 'form', component: EmployeeFormComponent },
            //   { path: 'view:id', component: EmployeeViewComponent },
            //   { path: 'transfer', component: EmployeeTransferFormComponent },
            //   { path: 'resignation', component: EmployeeRegignationComponent },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RegistrationRoutingModule { }
