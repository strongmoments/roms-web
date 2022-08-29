import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { LeaveManagementRoutingModule } from './leave-management.routing';
import { LeaveApplyFormComponent } from './leave-apply-form/leave-apply-form.component'
import { LeaveRequestListComponent } from './leave-request-list/leave-request-list.component';


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        LeaveManagementRoutingModule
    ],
    declarations: [
        LeaveApplyFormComponent,
        LeaveRequestListComponent
    ]
})
export class LeaveManagementModule { }
