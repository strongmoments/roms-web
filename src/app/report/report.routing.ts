import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FullComponent } from '../layouts/full/full.component';
import { LeaveReportComponent } from './leave-report/leave-report.component';
import { ResignationReportComponent } from './resignation-report/resignation-report.component';
const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    // pathMatch: 'full',
    children: [
      { path: 'leave', component: LeaveReportComponent },
      { path: 'resignation', component: ResignationReportComponent }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRoutingModule { }
