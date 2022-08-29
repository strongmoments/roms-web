import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FullComponent } from '../layouts/full/full.component';
import { LeaveApplyFormComponent } from './leave-apply-form/leave-apply-form.component';
import { LeaveRequestListComponent } from './leave-request-list/leave-request-list.component';

const routes: Routes = [
    {
        path: '',
        component: FullComponent,
        children: [
            { path: '', component: LeaveApplyFormComponent, pathMatch: 'full' },
            { path: 'leave-request', component: LeaveRequestListComponent },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LeaveManagementRoutingModule { }
