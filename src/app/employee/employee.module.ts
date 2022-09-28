import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { EmployeeRoutingModule } from './employee.routing';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { EmployeeViewComponent } from './employee-view/employee-view.component';
import { EmployeeTransferFormComponent } from './employee-transfer-form/employee-transfer-form.component';
import { EmployeeResignationComponent } from './employee-resignation/employee-resignation.component';
import { EmployeeResignationListComponent } from './employee-resignation-list/employee-resignation-list.component';
import { EmployeeAddComponent } from './employee-add/employee-add.component';
import { OnboardingListComponent } from './onboarding-list/onboarding-list.component';

@NgModule({
  imports: [CommonModule, SharedModule, EmployeeRoutingModule],
  declarations: [
    EmployeeListComponent,
    EmployeeFormComponent,
    EmployeeViewComponent,
    EmployeeTransferFormComponent,
    EmployeeResignationComponent,
    EmployeeResignationListComponent,
    EmployeeAddComponent,
    OnboardingListComponent,
  ],
})
export class EmployeeModule {}
