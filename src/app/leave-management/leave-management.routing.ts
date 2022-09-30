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
            {
                path: 'apply-leave', component: LeaveApplyFormComponent, pathMatch: 'full',
                data: {
                    title: 'Request Leave ',
                    urls: [{ title: 'Leave', url: '/leave/apply-leave' }, { title: 'Apply Leave' }],
                }
            },
            {
                path: 'leave-request', component: LeaveRequestListComponent,
                data: {
                    title: 'Leave Request',
                    urls: [{ title: 'My Staff', url: '/' }, { title: 'Leave Request' }],
                }
            },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LeaveManagementRoutingModule { }
