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
import { DemandListComponent } from './demand-list/demand-list.component';

const routes: Routes = [
    {
        path: '',
        component: FullComponent,
        // pathMatch: 'full',
        children: [
            { path: 'list', component: RegistrationListComponent,
                    data: {
                    title: 'Registrations',
                    urls: [{ title: 'People & Culture', url: '/' }, { title: 'Registration List' }],
                }
            },
            { path: 'create-user', component: CreateUserComponent,
            data: {
                title: 'Create-User',
                urls: [{ title: 'People & Culture', url: '/' }, { title: 'Create-User' }],
            } },
            { path: 'recruitment', component: RecruitmentComponent,
                    data: {
                    title: 'Recruitment',
                    urls: [{ title: 'People & Culture', url: '/' }, { title: 'Recruitment' }],
                }
            },
            { path: 'recommend', component: RecommendComponent,
        
            data: {
                title: 'Recruitment',
                urls: [{ title: 'People & Culture', url: '/' }, { title: 'Recruitment' }],
            }},
            { path: 'job-recommend', component: JobRecommendComponent,
                data: {
                title: 'Job-Board',
                urls: [{ title: 'People & Culture', url: '/' }, { title: 'Recruitment' }],
            }},
            { path: 'recruitment-details', component: RecruitmentDetailsComponent,
            data: {
                title: 'Recruitment',
                urls: [{ title: 'People & Culture', url: '/' }, { title: 'Recruitment' }],
            } },
            { path: 'transfer-list', component: TransferListComponent,
            data: {
                title: 'Transfer-List',
                urls: [{ title: 'People & Culture', url: '/' }, { title: 'Transfer-List' }],
            } },
            { path: 'demand-list', component: DemandListComponent },
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
