import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLayoutComponent } from '../shared/layout/main-layout/main-layout.component';
import { LeaveApplyFormComponent } from './leave-apply-form/leave-apply-form.component';
import { LeaveRequestListComponent } from './leave-request-list/leave-request-list.component';

const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: '', component: LeaveApplyFormComponent },
            { path: 'leave-request', component: LeaveRequestListComponent },


        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LeaveManagementRoutingModule { }
