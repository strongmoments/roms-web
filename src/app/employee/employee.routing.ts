import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLayoutComponent } from '../shared/layout/main-layout/main-layout.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeTransferFormComponent } from './employee-transfer-form/employee-transfer-form.component';
import { EmployeeViewComponent } from './employee-view/employee-view.component';
import { EmployeeRegignationComponent } from './employee-regignation/employee-regignation.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: EmployeeListComponent },
      { path: 'form', component: EmployeeFormComponent },
      { path: 'view:id', component: EmployeeViewComponent },
      { path: 'transfer', component: EmployeeTransferFormComponent },
      { path: 'resignation', component: EmployeeRegignationComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeRoutingModule {}
