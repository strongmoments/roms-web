import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FullComponent } from '../layouts/full/full.component';
import { NotificationComponent } from './notification.component';
// import { ResignationReportComponent } from './resignation-report/resignation-report.component';

const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    // pathMatch: 'full',
    children: [
      { path: '', component: NotificationComponent },
      //   { path: 'resignation', component: ResignationReportComponent },
      //   { path: 'form', component: EmployeeFormComponent },
      //   { path: 'view:id', component: EmployeeViewComponent },
      //   { path: 'transfer', component: EmployeeTransferFormComponent },
      //   { path: 'resignation', component: EmployeeRegignationComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationRoutingModule {}
