import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RegistrationListComponent } from '../registration/registration-list/registration-list.component';
import { CreateUserComponent } from '../registration/create-user/create-user.component';
import { RegistrationRoutingModule } from './registration.routing';
import { UserCreatedSuccessDialogComponent } from './user-created-success-dialog/user-created-success-dialog.component';
import { RecruitmentComponent } from './recruitment/recruitment.component';
import { RecommendComponent } from './recommend/recommend.component';
import { JobRecommendComponent } from './job-recommend/job-recommend.component';
import { RecruitmentDetailsComponent } from './recruitment-details/recruitment-details.component';
import { TransferListComponent } from './transfer-list/transfer-list.component';


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RegistrationRoutingModule
    ],
    declarations: [
        RegistrationListComponent,
        CreateUserComponent,
        UserCreatedSuccessDialogComponent,
        RecruitmentComponent,
        RecommendComponent,
        JobRecommendComponent,
        RecruitmentDetailsComponent,
        TransferListComponent
    ]
})
export class RegistrationModule { }
