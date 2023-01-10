import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ReportRoutingModule } from './report.routing';
import { LeaveReportComponent } from './leave-report/leave-report.component';
import { ResignationReportComponent } from './resignation-report/resignation-report.component';
import { PrestartReportComponent } from './prestart-report/prestart-report.component';


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        ReportRoutingModule
    ],
    declarations: [
        LeaveReportComponent,
        ResignationReportComponent,
        PrestartReportComponent
    ]
})
export class ReportModule { }
