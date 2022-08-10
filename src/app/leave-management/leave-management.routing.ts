import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLayoutComponent } from '../shared/layout/main-layout/main-layout.component';
import { LeaveApplyFormComponent } from './leave-apply-form/leave-apply-form.component';

const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: '', component: LeaveApplyFormComponent },

        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LeaveManagementRoutingModule { }
