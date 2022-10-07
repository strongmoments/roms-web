import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeTransferFormComponent } from './employee-transfer-form/employee-transfer-form.component';
import { EmployeeViewComponent } from './employee-view/employee-view.component';
import { EmployeeResignationComponent } from './employee-resignation/employee-resignation.component';
import { FullComponent } from '../layouts/full/full.component';
import { EmployeeResignationListComponent } from './employee-resignation-list/employee-resignation-list.component';
import { EmployeeAddComponent } from './employee-add/employee-add.component';
import { OnboardingListComponent } from './onboarding-list/onboarding-list.component';
import { EmployeeProfileComponent } from './employee-profile/employee-profile.component';

const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    // pathMatch: 'full',
    children: [
      { path: 'employee-list', component: EmployeeListComponent,
      data: {
        title: 'Employee List ',
        urls: [{ title: 'Dashboard', url: '/' }, { title: 'My Staff' }],
      } },
      { path: 'form', component: EmployeeFormComponent },
      { path: 'view:id', component: EmployeeViewComponent },
      { path: 'transfer', component: EmployeeTransferFormComponent },
      { path: 'resignation', component: EmployeeResignationComponent,
      data: {
        title: 'Resignation ',
        urls: [{ title: 'Dashboard', url: '/' }, { title: 'Personal' }],
      }  },
      {
        path: 'resignation-list', component: EmployeeResignationListComponent,
        data: {
          title: 'Resignations',
          urls: [{ title: 'Dashboard', url: '/' }, { title: 'My Staff' }],
        }
      },
      { path: 'employee-add', component: EmployeeAddComponent },
      {
        path: 'onboarding-list', component: OnboardingListComponent,
        data: {
          title: 'Onboarding ',
          urls: [{ title: 'Dashboard', url: '/' }, { title: 'People & Culture' }],
        }
      },
      {
        path: 'employee-profile', component: EmployeeProfileComponent,
        data: {
          title: 'Employee Profile',
          urls: [{ title: 'Dashboard', url: '/' }, { title: 'People & Culture' }],
        }
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeRoutingModule { }
