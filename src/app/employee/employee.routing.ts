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

const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    // pathMatch: 'full',
    children: [
      { path: '', component: EmployeeListComponent },
      { path: 'form', component: EmployeeFormComponent },
      { path: 'view:id', component: EmployeeViewComponent },
      { path: 'transfer', component: EmployeeTransferFormComponent },
      { path: 'resignation', component: EmployeeResignationComponent },
      {
        path: 'resignation-list', component: EmployeeResignationListComponent,
        data: {
          title: 'Resignation-list',
          urls: [{ title: 'My Staff', url: '/' }, { title: 'Resignation Request' }],
        }
      },
      { path: 'employee-add', component: EmployeeAddComponent },
      {
        path: 'onboarding-list', component: OnboardingListComponent,
        data: {
          title: 'Onboarding-list',
          urls: [{ title: 'My Staff', url: '/' }, { title: 'Onboarding list' }],
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
