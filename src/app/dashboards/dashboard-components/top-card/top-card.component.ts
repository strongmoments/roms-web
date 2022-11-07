import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Title } from '@angular/platform-browser';
import { AlertService } from 'src/app/core/services';
import { Utils } from 'src/app/core/_helpers/util';
import { CustomMessage } from 'src/app/custom-message';
import { Globals } from 'src/app/globals';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { LeavePopupDialogComponent } from 'src/app/shared/leave-popup-dialog/leave-popup-dialog.component';

@Component({
  selector: 'app-top-card',
  templateUrl: './top-card.component.html',
  styleUrls: ['./top-card.component.scss'],
})
export class TopCardComponent {
  // @ViewChild('resourceDemandDialog,') resourceDemandDialog!: TemplateRef<any>;
  dashboardData: any = {};
  submitted: boolean = false;
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private dialog: MatDialog,
  ) {
    this.authService.getDashboard().subscribe((result: any) => {
      this.dashboardData = result;
      console.log(result);
    });
  }

  redirect() {
    console.log(this);
    this.router.navigate(['/employee/employee-list']);
  }

  // onClick() {
  //   this.submitted = true;
  //   this.openDialog({});
  // }

  openDialog() {
    console.log(this.dashboardData.onLeaveTodayEmployeeList, 'this.dashboardData.onLeaveTodayEmployeeListthis.dashboardData.onLeaveTodayEmployeeList');
    const dialogRef = this.dialog.open(LeavePopupDialogComponent, {
      width: '55em',
      height: '35em',
      data: { data: this.dashboardData && this.dashboardData.onLeaveTodayEmployeeList?this.dashboardData.onLeaveTodayEmployeeList:null },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // this.router.navigate(['/registration/list']);
      // console.log('The dialog was closed');
    });
  }
}
