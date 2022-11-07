
import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DatePipe } from '@angular/common';
import { AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { AlertService, EmployeeService } from 'src/app/core/services';
import { LeaveService } from 'src/app/core/services/leave.service';
import { Utils } from 'src/app/core/_helpers/util';
import { Globals } from 'src/app/globals';
import { ViewOptions } from 'src/app/_models';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { element } from 'protractor';
import { UntypedFormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-leave-popup-dialog',
  templateUrl: './leave-popup-dialog.component.html',
  styleUrls: ['./leave-popup-dialog.component.scss']
})
export class LeavePopupDialogComponent implements OnInit, OnChanges {
  records: any;
  submitted: boolean = false;
  displayedColumns: string[] = [
    // 'employeePic',
    'employeeName',
    'employeeNo',
    'employeeRole',
    'departments.description',

  ];

  // convertedStartDate: convertedStartDate,
  // employeeName: employeeName,


  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  pageNo = 0;
  pageSize = 10;
  totalRecords: number = 0;
  search: string = ''; //by default 0 for pending list
  // currentDate: any = new Date();
  // expandedElement: any = null;
  startDate: Date = new Date(new Date().setMonth(new Date().getMonth() - 1));
  endDate: Date = new Date(new Date().setDate(new Date().getDate() + 1));
  // status: any = 0;
  // departmentId: any = '';
  // employeeType: any = '';
  // employeeTypeList: any = [];
  // departmentList: any = [];
  // removedRows: any = [];
  // selectedTabIndex: number = 0;
  selectedId: string = '';

  addEMPmessage = new UntypedFormControl('Add Employee');
  constructor(
    private dialogRef: MatDialogRef<LeavePopupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public util: Utils,
    globals: Globals,
    private datePipe: DatePipe,
    private employeeService: EmployeeService,
    private router: Router
  ) {
    this.dataSource.data = this.data && this.data.data ? this.data.data : [];
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes, 'rwecodd');
    // this.dataSource.data = this.data;
  }


  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit(): void {
  }


  redirect() {
    this.router.navigate(['/report/leave'], { queryParams: { tab: 'current' } });
    this.dialogRef.close();
  }

}
