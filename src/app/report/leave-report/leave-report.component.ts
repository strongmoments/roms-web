import { animate, state, style, transition, trigger } from '@angular/animations';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs';
import { AlertService } from 'src/app/core/services';
import { LeaveService } from 'src/app/core/services/leave.service';
import { Utils } from 'src/app/core/_helpers/util';
import { Globals } from 'src/app/globals';
import { ViewOptions } from 'src/app/_models';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { AuthenticationService } from 'src/app/core/services/auth.service';
@Component({
  selector: 'app-leave-report',
  templateUrl: './leave-report.component.html',
  styleUrls: ['./leave-report.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class LeaveReportComponent implements OnInit, AfterViewInit {
  globals: Globals;
  // leaveHours: number = 0;
  // form: FormGroup;
  submitted: boolean = false;
  // displayedColumnsLeave: string[] = 
  displayedColumns: string[] = ['staffName', 'applyDate', 'leave_type', 'dates', 'days', 'time', 'hours', 'leaveReason', 'approver', 'dateOfApproval', 'action'];
  displayedColumnsHistory: string[] = ['reportName', 'dateRange', 'createDate'];

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  dataSourceHistory: MatTableDataSource<any> = new MatTableDataSource<any>();

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatPaginator, { static: false }) paginatorHistory: MatPaginator = Object.create(null);

  @ViewChild(MatSort, { static: false }) sort: MatSort = Object.create(null);
  @ViewChild(MatSort, { static: false }) sortHistory: MatSort = Object.create(null);
  pagesize = 10;
  pageNo = 0;
  pageSize = 10;
  totalRecords: number = 0;
  search: string = '';//by default 0 for pending list
  currentDate: any = new Date();
  expandedElement: any = null;
  startDate: Date = new Date(new Date().setMonth(new Date().getMonth() - 1));
  endDate: Date = new Date();
  status: any = 2;
  departmentId: any = '';
  employeeType: any = '';
  employeeTypeList: any = [];
  departmentList: any = [];
  constructor(breakpointObserver: BreakpointObserver, public util: Utils, globals: Globals, private fb: FormBuilder, private alertService: AlertService, private leaveService: LeaveService, private datePipe: DatePipe, private activatedRoute: ActivatedRoute, private authService: AuthenticationService) {
    this.globals = globals;

    this.authService.getAllEmployeeType().subscribe((result: any) => {
      this.employeeTypeList = result && result.data && result.data.length > 0 ? result.data : [];
    });


    this.authService.getAllDepartmentType().subscribe((result: any) => {
      this.departmentList = result && result.data && result.data.length > 0 ? result.data : [];
    });
    // breakpointObserver.observe(['(max-width: 600px)']).subscribe((result) => {
    //   this.displayedColumns = result.matches
    //     ? ['id', 'name', 'progress', 'color']
    //     : ['id', 'name', 'progress', 'color'];
    // });

    // Create 100 users
    // const users: UserData[] = [];
    // for (let i = 1; i <= 100; i++) {
    //   users.push(createNewUser(i));
    // }

    // Assign the data to the data source for the table to render
    // this.dataSource = new MatTableDataSource(users);
  }


  ngOnInit(): void {
    // this.displayedColumns = this.displayedColumnsLeave;
    this.refresh(this.getDefaultOptions());
  }

  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit(): void {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    this.dataSourceHistory.sort = this.sortHistory;
    this.dataSource.sort = this.sort;
    this.paginator.page.subscribe((page: PageEvent) => {
      this.refresh(this.getDefaultOptions());
    });

    this.paginatorHistory.page.subscribe((page: PageEvent) => {
      this.refresh(this.getDefaultOptions());
    });
  }


  onTableScroll(e: any) {
    const tableViewHeight = e.target.offsetHeight // viewport: ~500px
    const tableScrollHeight = e.target.scrollHeight // length of all table
    const scrollLocation = e.target.scrollTop; // how far user scrolled

    // If the user has scrolled within 200px of the bottom, add more data
    const buffer = 200;
    const limit = tableScrollHeight - tableViewHeight - buffer;
    console.log(scrollLocation, limit, 'scrollLocation > limit')
    if (scrollLocation > limit) {
      if (this.dataSource.data.length < this.totalRecords) {
        this.refresh(this.getDefaultOptions(), true);
      }
      // this.dataSource = this.dataSource.concat(ELEMENT_DATA);
    }
  }

  refresh(options: ViewOptions, isScrolled: boolean = false) {
    let startDate = this.startDate ? moment(new Date(this.startDate).toUTCString()).utc().format('DD-MM-YYYY') : '';
    let endDate = this.endDate ? moment(new Date(this.endDate).toUTCString()).utc().format('DD-MM-YYYY') : '';

    let queryData = { toDate: startDate, fromDate: endDate, searchText: this.search, departmentId: this.departmentId, employeeTypeId: this.departmentId, leaveStatus: this.status };


    this.leaveService.getAllEmployeeLeaves(options, queryData).pipe(first()).subscribe((result: any) => {
      this.totalRecords = result.totalElement;
      if (isScrolled == true) {
        this.dataSource.data = [...this.dataSource.data, ...result.data];
      } else {
        this.dataSource.data = result.data;
      }
      console.log(result, 'result.data')
    });
  }


  refreshHistory(options: ViewOptions) {

    this.authService.getAllExportHistory(options).pipe(first()).subscribe((result: any) => {
      this.totalRecords = result.totalElement;
      this.dataSourceHistory.data = result.data;
      console.log(result, 'result.data')
    });
  }

  getDefaultOptions() {
    let obj = this.paginator;
    let sort = this.sort;
    let pageSize = (obj != undefined ? (obj.pageIndex == null ? 1 : obj.pageIndex + 1) : 1);

    const options: ViewOptions = {
      sortField: (sort !== undefined ? sort.active : 'fullName'),
      sortDirection: (sort !== undefined ? sort.direction : 'asc'),
      // page: (obj != undefined ? (obj.pageIndex == null ? 1 : obj.pageIndex + 1) : 1),
      page: pageSize - 1,
      search: '',
      query: '',
      pageSize: (obj != undefined ? (obj.pageSize == null ? this.pagesize : obj.pageSize) : this.pagesize)
    };
    return options;
  }

  getDefaultOptionsHistory() {
    let obj = this.paginator;
    let sort = this.sort;
    let pageSize = (obj != undefined ? (obj.pageIndex == null ? 1 : obj.pageIndex + 1) : 1);

    const options: ViewOptions = {
      sortField: (sort !== undefined ? sort.active : 'fullName'),
      sortDirection: (sort !== undefined ? sort.direction : 'asc'),
      // page: (obj != undefined ? (obj.pageIndex == null ? 1 : obj.pageIndex + 1) : 1),
      page: pageSize - 1,
      search: '',
      query: '',
      pageSize: (obj != undefined ? (obj.pageSize == null ? this.pagesize : obj.pageSize) : this.pagesize)
    };
    return options;
  }

  getStatus(status: any) {
    return this.globals.leaveStatus.find((elem: any) => {
      return elem.value == status
    })?.name;
  }

  getStatusColor(status: any) {
    return this.globals.leaveStatus.find((elem: any) => {
      return elem.value == status
    })?.colorClass;
  }

  applyFilter(isTextSearch: boolean = false): void {
    console.log(this.search, 'search', this.startDate, 'startdate', this.endDate, 'enddate');
    this.search = this.search.trim(); // Remove whitespace
    this.search = this.search.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = this.search;
    if (isTextSearch) {

    } else {
      this.refresh(this.getDefaultOptions());
    }
  }




  onTabChanged(index: number) {
    // this.tabIndex = index;
    this.dataSource.data = [];

    this.totalRecords = 0;
    this.paginator.pageIndex = 0;
    this.pageNo = 0;
    this.pageSize = 10;
    this.search = '';
    this.status = 2;
    this.departmentId = '';
    this.employeeType = '';
    this.dataSourceHistory.data = [];
    this.paginatorHistory.pageIndex = 0;
    // this.selectedTabIndex = index;
    // this.displayedColumns = index == 0 ? this.displayedColumnsLeave : this.displayedColumnsHistory;
    // console.log(event, 'event')

    if (index == 1) {
      this.refreshHistory(this.getDefaultOptionsHistory());
      // this.historyList();
    } else {
      this.refresh(this.getDefaultOptions());
    }

  }



  exportCsv() {
    // const replacer = (key:any, value:any) => value === null ? '' : value; // specify how you want to handle null values here
    // const header = Object.keys(this.displayedColumns);
    // let csv = this.dataSource.data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    // csv.unshift(header.join(','));
    // let csvArray = csv.join('\r\n');
    let csvArray: any = ['Staff Name,Applied On,Leave Type,Dates,Days,Time,Hours,Reason,Comments,Status\r\n'];
    for (let i = 0; i < this.dataSource.data.length; i++) {
      let item = this.dataSource.data[i];
      console.log(this.dataSource.data[i], 'this.dataSource.data')
      let row: string = `${item?.employe?.firstName} ${item?.employe?.firstName},${(this.datePipe.transform(item.applyDate, 'dd/MM/yyyy'))},${item.leaveType?.leaveDescription},${this.datePipe.transform(item.startDateTime, 'dd/MM/yyyy')} to ${this.datePipe.transform(item.endDateTime, 'dd/MM/yyyy')},${item.totalDay},${(item.totalHour > 0) ? (this.datePipe.transform(item.startDateTime, 'shortTime') + 'to' + (this.datePipe.transform(item.endDateTime, 'shortTime'))) : ''},${item.totalHour},${item.leaveReason},${item.reviewerRemark},${this.getStatus(item.leaveStatus)}\r\n`;
      console.log(row)
      csvArray.push(row)
    }
    // console.log(csvArray)
    let fileName = `leave_report_${new Date().getTime()
      }.csv`;
    let data = {
      "reportName": fileName,
      "dateRange": `${this.datePipe.transform(this.startDate, 'd MMMM y')} to ${this.datePipe.transform(this.endDate, 'd MMMM y')}`,
      "filters": {
        "empoyeeTyeId": this.employeeType,
        "departmentId ": this.departmentId,
        "leaveStatus": this.status
      }
    };

    console.log(data)
    this.authService.saveExportHistory(data).subscribe();
    var blob = new Blob(csvArray, { type: 'text/csv' });
    saveAs(blob, fileName);

  }
}
/** Builds and returns a new User. */
// function createNewUser(id: number): UserData {
//   const name =
//     NAMES[Math.round(Math.random() * (NAMES.length - 1))] +
//     ' ' +
//     NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) +
//     '.';
//   // tslint:disable-next-line - Disables all
//   return {
//     id: id.toString(),
//     name: name,
//     progress: Math.round(Math.random() * 100).toString(),
//     color: COLORS[Math.round(Math.random() * (COLORS.length - 1))],
//   };

// }

// export interface UserData {
//   id: string;
//   name: string;
//   progress: string;
//   color: string;
// }
