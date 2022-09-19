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
      { path: 'resignation-list', component: EmployeeResignationListComponent },
      { path: 'employee-add', component: EmployeeAddComponent }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeRoutingModule { }
