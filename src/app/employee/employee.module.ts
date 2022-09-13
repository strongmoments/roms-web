import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { EmployeeRoutingModule } from './employee.routing';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { EmployeeViewComponent } from './employee-view/employee-view.component';
import { EmployeeTransferFormComponent } from './employee-transfer-form/employee-transfer-form.component';
import { EmployeeResignationComponent } from './employee-resignation/employee-resignation.component';

@NgModule({
  imports: [CommonModule, SharedModule, EmployeeRoutingModule],
  declarations: [
    EmployeeListComponent,
    EmployeeFormComponent,
    EmployeeViewComponent,
    EmployeeTransferFormComponent,
    EmployeeResignationComponent,
  ],
})
export class EmployeeModule {}
