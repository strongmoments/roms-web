import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RegistrationListComponent } from '../registration/registration-list/registration-list.component';
import { CreateUserComponent } from '../registration/create-user/create-user.component';
import { RegistrationRoutingModule } from './registration.routing';
import { UserCreatedSuccessDialogComponent } from './user-created-success-dialog/user-created-success-dialog.component';
import { RecruitmentComponent } from './recruitment/recruitment.component';


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
        RecruitmentComponent
    ]
})
export class RegistrationModule { }
