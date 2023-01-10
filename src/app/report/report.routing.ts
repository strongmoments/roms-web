import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FullComponent } from '../layouts/full/full.component';
import { LeaveReportComponent } from './leave-report/leave-report.component';
import { ResignationReportComponent } from './resignation-report/resignation-report.component';
import { PrestartReportComponent } from './prestart-report/prestart-report.component';
const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    // pathMatch: 'full',
    children: [
      {
        path: 'leave', component: LeaveReportComponent,
        data: {
          title: 'Staff Leaves',
          urls: [{ title: 'Dashboard', url: '/' }, { title: 'People & Culture' }],
        }
      },
      {
        path: 'resignation', component: ResignationReportComponent,
        data: {
          title: 'Resignations',
          urls: [{ title: 'Dashboard', url: '/' }, { title: 'People & Culture' }],
        }
      },
      {
        path: 'prestart', component: PrestartReportComponent,
        data: {
          title: 'Prestart Report',
          urls: [{ title: 'Dashboard', url: '/' }, { title: 'Operations' }],
        }
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRoutingModule { }
