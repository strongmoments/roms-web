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

import { RecommendationListComponent } from './recommendation-list/recommendation-list.component';

const routes: Routes = [
    {
        path: '',
        component: FullComponent,
        // pathMatch: 'full',
        children: [
            { path: 'list', component: RegistrationListComponent,
                    data: {
                    title: 'Registrations',
                    urls: [{ title: 'Dashboard', url: '/' }, { title: 'People & Culture' }],
                }
            },
            { path: 'create-user', component: CreateUserComponent,
            data: {
                title: 'Create User',
                urls: [{ title: 'Dashboard', url: '/' }, { title: 'People & Culture' }],
            } },
            { path: 'recruitment', component: RecruitmentComponent,
                    data: {
                    title: 'Recruitment',
                    urls: [{ title: 'Dashboard', url: '/' }, { title: 'People & Culture' }],
                }
            },
            { path: 'recommend', component: RecommendComponent,
        
            data: {
                title: 'Recruitment',
                urls: [{ title: 'Dashboard', url: '/' }, { title: 'People & Culture' }],
            }},
            { path: 'job-recommend', component: JobRecommendComponent,
                data: {
                title: 'Demand Board',
                urls: [{ title: 'Dashboard', url: '/' }, { title: 'People & Culture' }],
            }},
            { path: 'recruitment-details', component: RecruitmentDetailsComponent,
            data: {
                title: 'Recruitment',
                urls: [{ title: 'Dashboard', url: '/' }, { title: 'People & Culture' }],
            } },
            { path: 'transfer-list', component: TransferListComponent,
            data: {
                title: 'Transfer List',
                urls: [{ title: 'Dashboard', url: '/' }, { title: 'People & Culture' }],
            } },
            { path: 'demand-list', component: DemandListComponent },
            { path: 'recommendation-list', component: RecommendationListComponent,
            data: {
                title: 'Recommendation List',
                urls: [{ title: 'Dashboard', url: '/' }, { title: 'People & Culture' }],
            } },
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
