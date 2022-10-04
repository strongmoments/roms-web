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
                    title: 'Leave ',
                    urls: [{ title: 'Dashboard', url: '/leave/apply-leave' }, { title: 'Personal' }],
                }
            },
            {
                path: 'leave-request', component: LeaveRequestListComponent,
                data: {
                    title: 'Leave Requests',
                    urls: [{ title: 'Dashboard', url: '/' }, { title: 'My Staff' }],
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
