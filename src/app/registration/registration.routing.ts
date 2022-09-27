import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FullComponent } from '../layouts/full/full.component';
import { RegistrationListComponent } from '../registration/registration-list/registration-list.component';
import { CreateUserComponent } from '../registration/create-user/create-user.component';
import { RecruitmentComponent } from './recruitment/recruitment.component';
import { RecommendComponent } from './recommend/recommend.component';
import { JobRecommendComponent } from './job-recommend/job-recommend.component';
import { RecruitmentDetailsComponent } from './recruitment-details/recruitment-details.component';
import { TransferListComponent } from './transfer-list/transfer-list.component';

const routes: Routes = [
    {
        path: '',
        component: FullComponent,
        // pathMatch: 'full',
        children: [
            { path: 'list', component: RegistrationListComponent },
            { path: 'create-user', component: CreateUserComponent },
            { path: 'recruitment', component: RecruitmentComponent },
            { path: 'recommend', component: RecommendComponent },
            { path: 'job-recommend', component: JobRecommendComponent },
            { path: 'recruitment-details', component: RecruitmentDetailsComponent },
            { path: 'transfer-list', component: TransferListComponent },
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
