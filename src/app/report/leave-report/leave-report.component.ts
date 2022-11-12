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
import { element } from 'protractor';
import { ImagePreviewDialog } from 'src/app/shared/image-preview-dialog/image-preview-dialog.component';
import { MatDialog } from '@angular/material/dialog';
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
  displayedColumns: string[] = [
    'select',
    'staffName',
    'convertedAppliedOn',
    'leaveTypeName',
    'dates',
    'days',
    'time',
    'hours',
    'action',
    // 'approveStatus',
    // 'leaveReason',
    'managerName',
    'status',
    'convertedApprovalDate',
  ];
  displayedColumnsHistory: string[] = ['createDate', 'dateRange', 'reportName', 'sign'];

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
  search: string = ''; //by default 0 for pending list
  currentDate: any = new Date();
  expandedElement: any = null;
  startDate: Date = new Date(new Date().setMonth(new Date().getMonth() - 1));
  endDate: Date = new Date();
  status: any = 2;
  departmentId: any = '';
  employeeType: any = '';
  employeeTypeList: any = [];
  departmentList: any = [];
  removedRows: any = [];
  selectedTabIndex: number = 0;
  user: any;
  constructor(
    breakpointObserver: BreakpointObserver,
    public util: Utils,
    globals: Globals,
    private fb: FormBuilder,
    private alertService: AlertService,
    private leaveService: LeaveService,
    private datePipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private authService: AuthenticationService,
    private dialog: MatDialog
  ) {
    this.globals = globals;
    this.user = this.authService.getCurrentUser();
    this.authService.getAllEmployeeType().subscribe((result: any) => {
      this.employeeTypeList = result && result.data && result.data.length > 0 ? result.data : [];
    });

    this.authService.getAllDepartmentType().subscribe((result: any) => {
      this.departmentList = result && result.data && result.data.length > 0 ? result.data : [];
    });

    this.activatedRoute.queryParams.subscribe(queryParams => {
      if (queryParams['tab'] && queryParams['tab'] == 'current') {
        this.selectedTabIndex = 1;
        // this.onTabChanged(1);
      }
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
    if (this.selectedTabIndex == 1) {
      this.refreshCurrent(this.getDefaultOptions());

    } else {

      this.refresh(this.getDefaultOptions());
    }
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
    this.paginator?.page.subscribe((page: PageEvent) => {
      if (this.selectedTabIndex == 0) {
        this.refresh(this.getDefaultOptions());
      }
    });

    this.paginatorHistory?.page.subscribe((page: PageEvent) => {
      if (this.selectedTabIndex == 1) {
        this.refreshHistory(this.getDefaultOptions());
      }
    });
  }

  removeRow(id: string) {
    // console.log(index, 'index');
    let index = this.removedRows.indexOf(id);
    // if (this.removedRows && index === -1) {
    //   this.removedRows.push(id);
    // } else {
    //   this.removedRows.splice(index, 1);
    // }
    // let data=this.dataSource.data;

    // console.log(index,data.splice(index,1))
    // this.dataSource.data = this.dataSource.data.filter((elem: any) => elem.id != id);
  }

  onTableScroll(e: any) {
    const tableViewHeight = e.target.offsetHeight; // viewport: ~500px
    const tableScrollHeight = e.target.scrollHeight; // length of all table
    const scrollLocation = e.target.scrollTop; // how far user scrolled

    // If the user has scrolled within 200px of the bottom, add more data
    const buffer = 10;
    const limit = tableScrollHeight - tableViewHeight - buffer;
    // console.log(scrollLocation, limit, 'scrollLocation > limit');
    if (scrollLocation > limit) {
      if (this.dataSource.data.length < this.totalRecords) {
        this.pageNo = this.pageNo + 1;
        this.refresh(this.getDefaultOptions(), true);
      }
      // this.dataSource = this.dataSource.concat(ELEMENT_DATA);
    }
  }

  refresh(options: ViewOptions, isScrolled: boolean = false) {
    let startDate = this.startDate
      ? moment(new Date(new Date(this.startDate).setHours(0, 0, 0, 0)).toUTCString()).format('DD-MM-YYYY HH:mm:ss')
      : '';
    let endDate = this.endDate
      ? moment(new Date(new Date(this.endDate).setHours(23, 59, 59, 59)).toUTCString()).format('DD-MM-YYYY HH:mm:ss')
      : '';

    let queryData = {
      toDate: endDate,
      fromDate: startDate,
      departmentId: this.departmentId == 'all' ? '' : this.departmentId,
      employeeTypeId: this.employeeType == 'all' ? '' : this.employeeType,
      status: `${this.status}`,
    };
    // console.log(queryData, 'queryData');

    this.leaveService
      .getAllEmployeeLeaves(options, queryData)
      .pipe(first())
      .subscribe((result: any) => {
        this.totalRecords = result.totalElement;
        let data: any = [];
        for (let i = 0; i < result.data.length; i++) {
          let staffName = `${result.data[i].employe?.firstName} ${result.data[i].employe?.lastName}`;
          let managerName = `${result.data[i].approver?.firstName} ${result.data[i].approver?.lastName}`;
          let convertedAppliedOn = this.datePipe.transform(result.data[i].applyDate, 'dd/MM/yyyy');
          let convertedApprovalDate = result.data[i].dateOfApproval
            ? this.datePipe.transform(result.data[i].dateOfApproval, 'dd/MM/yyyy')
            : '';
          let convertedStartDate = this.datePipe.transform(result.data[i].startDateTime, 'MMM d');
          let convertedEndDate = this.datePipe.transform(result.data[i].endDateTime, 'MMM d,y');
          let convertedStartTime = this.datePipe.transform(
            result.data[i].startDateTime,
            'shortTime',
          );
          let convertedEndTime = this.datePipe.transform(result.data[i].endDateTime, 'shortTime');
          let leaveTypeName = result.data[i]?.leaveType?.leaveDescription;
          let status = this.getStatus(result.data[i]?.leaveStatus);

          data.push({
            ...result.data[i],
            leaveTypeName: leaveTypeName,
            status: status,
            convertedStartTime: convertedStartTime,
            convertedEndTime: convertedEndTime,
            convertedStartDate: convertedStartDate,
            convertedEndDate: convertedEndDate,
            convertedApprovalDate: convertedApprovalDate,
            managerName: managerName,
            convertedAppliedOn: convertedAppliedOn,
            staffName: staffName,
          });
        }
        if (isScrolled == true) {
          this.dataSource.data = [...this.dataSource.data, ...data];
        } else {
          this.dataSource.data = data;
        }
        // console.log(data, 'result.data');
      });
  }

  refreshHistory(options: ViewOptions) {
    this.authService
      .getAllExportHistory(options)
      .pipe(first())
      .subscribe((result: any) => {
        this.totalRecords = result.totalElement;
        this.dataSourceHistory.data = result.data;
        // console.log(result, 'result.data');
      });
  }

  getDefaultOptions() {
    let obj = this.paginator;
    let sort = this.sort;
    let pageSize = obj != undefined ? (obj.pageIndex == null ? 1 : obj.pageIndex + 1) : 1;

    const options: ViewOptions = {
      sortField: sort !== undefined ? sort.active : 'fullName',
      sortDirection: sort !== undefined ? sort.direction : 'asc',
      // page: (obj != undefined ? (obj.pageIndex == null ? 1 : obj.pageIndex + 1) : 1),
      page: pageSize - 1,
      search: '',
      query: '',
      pageSize:
        obj != undefined ? (obj.pageSize == null ? this.pagesize : obj.pageSize) : this.pagesize,
    };
    return options;
  }

  getDefaultOptionsHistory() {
    let obj = this.paginator;
    let sort = this.sort;
    let pageSize = obj != undefined ? (obj.pageIndex == null ? 1 : obj.pageIndex + 1) : 1;

    const options: ViewOptions = {
      sortField: sort !== undefined ? sort.active : 'fullName',
      sortDirection: sort !== undefined ? sort.direction : 'asc',
      // page: (obj != undefined ? (obj.pageIndex == null ? 1 : obj.pageIndex + 1) : 1),
      page: pageSize - 1,
      search: '',
      query: '',
      pageSize:
        obj != undefined ? (obj.pageSize == null ? this.pagesize : obj.pageSize) : this.pagesize,
    };
    return options;
  }

  getStatus(status: any) {
    return this.globals.leaveStatus.find((elem: any) => {
      return elem.value == status;
    })?.name;
  }

  getStatusIcon(status: any) {
    return this.globals.leaveStatus.find((elem: any) => {
      return elem.value == status;
    })?.icon;
  }

  getStatusColor(status: any, isCheckbox: boolean = false) {
    let elem: any = this.globals.leaveStatus.find((elem: any) => {
      return elem.value == status;
    });
    return elem ? (isCheckbox == true ? elem.checkboxColorClass : elem.colorClass) : '';
  }

  applyFilter(isTextSearch: boolean = false): void {
    // console.log(this.search, 'search', this.startDate, 'startdate', this.endDate, 'enddate');
    this.search = this.search.trim(); // Remove whitespace
    this.search = this.search.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = this.search;
    if (isTextSearch) {
    } else {
      if (this.selectedTabIndex == 0) {
        this.refresh(this.getDefaultOptions());

      } else if (this.selectedTabIndex == 1) {
        this.refreshCurrent(this.getDefaultOptions());

      }
    }
  }

  onTabChanged(index: number) {
    // this.tabIndex = index;
    this.dataSource.data = [];

    this.totalRecords = 0;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.pageNo = 0;
    this.pageSize = 10;
    this.search = '';
    this.status = 2;
    this.departmentId = '';
    this.employeeType = '';
    if (this.dataSourceHistory) {
      this.dataSourceHistory.data = [];
    }

    if (this.paginatorHistory) {
      this.paginatorHistory.pageIndex = 0;

    } this.selectedTabIndex = index;
    // this.displayedColumns = index == 0 ? this.displayedColumnsLeave : this.displayedColumnsHistory;
    // console.log(event, 'event')

    if (index == 1) {
      this.refreshCurrent(this.getDefaultOptionsHistory());
    } else if (index == 2) {
      this.refreshHistory(this.getDefaultOptionsHistory());
    } else {
      this.refresh(this.getDefaultOptions());

    }
  }


  refreshCurrent(options: ViewOptions, isScrolled: boolean = false) {
    let startDate = this.startDate
      ? moment(new Date(new Date(this.startDate).setHours(0, 0, 0, 0)).toUTCString()).format('DD-MM-YYYY HH:mm:ss')
      : '';
    let endDate = this.endDate
      ? moment(new Date(new Date(this.endDate).setHours(23, 59, 59, 59)).toUTCString()).format('DD-MM-YYYY HH:mm:ss')
      : '';

    let queryData = {
      toDate: endDate,
      fromDate: startDate,
      departmentId: this.departmentId == 'all' ? '' : this.departmentId,
      employeeTypeId: this.employeeType == 'all' ? '' : this.employeeType,
      status: `${this.status}`,
    };
    // console.log(queryData, 'queryData');

    this.leaveService
      .getAllEmployeeLeavesCurrent(options, queryData)
      .pipe(first())
      .subscribe((result: any) => {
        this.totalRecords = result.totalElement;
        let data: any = [];
        for (let i = 0; i < result.data.length; i++) {
          let staffName = `${result.data[i].employe?.firstName} ${result.data[i].employe?.lastName}`;
          let managerName = `${result.data[i].approver?.firstName} ${result.data[i].approver?.lastName}`;
          let convertedAppliedOn = this.datePipe.transform(result.data[i].applyDate, 'dd/MM/yyyy');
          let convertedApprovalDate = result.data[i].dateOfApproval
            ? this.datePipe.transform(result.data[i].dateOfApproval, 'dd/MM/yyyy')
            : '';
          let convertedStartDate = this.datePipe.transform(result.data[i].startDateTime, 'MMM d');
          let convertedEndDate = this.datePipe.transform(result.data[i].endDateTime, 'MMM d,y');
          let convertedStartTime = this.datePipe.transform(
            result.data[i].startDateTime,
            'shortTime',
          );
          let convertedEndTime = this.datePipe.transform(result.data[i].endDateTime, 'shortTime');
          let leaveTypeName = result.data[i]?.leaveType?.leaveDescription;
          let status = this.getStatus(result.data[i]?.leaveStatus);

          data.push({
            ...result.data[i],
            leaveTypeName: leaveTypeName,
            status: status,
            convertedStartTime: convertedStartTime,
            convertedEndTime: convertedEndTime,
            convertedStartDate: convertedStartDate,
            convertedEndDate: convertedEndDate,
            convertedApprovalDate: convertedApprovalDate,
            managerName: managerName,
            convertedAppliedOn: convertedAppliedOn,
            staffName: staffName,
          });
        }
        if (isScrolled == true) {
          this.dataSource.data = [...this.dataSource.data, ...data];
        } else {
          this.dataSource.data = data;
        }
        // console.log(data, 'result.data');
      });
  }

  exportCsv() {
    // const replacer = (key:any, value:any) => value === null ? '' : value; // specify how you want to handle null values here
    // const header = Object.keys(this.displayedColumns);
    // let csv = this.dataSource.data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    // csv.unshift(header.join(','));
    // let csvArray = csv.join('\r\n');
    let csvArray: any = [
      'Staff Name,Applied On,Leave Type,Start Date,End Date,Days,Start Time,End Time,Hours,Reason,Comments,Status\r\n',
    ];
    for (let i = 0; i < this.dataSource.data.length; i++) {
      let item = this.dataSource.data[i];
      // console.log(this.dataSource.data[i], 'this.dataSource.data');
      let row: string = `${item?.employe?.firstName} ${item?.employe?.firstName
        },${this.datePipe.transform(item.applyDate, 'dd/MM/yyyy')},${item.leaveType?.leaveDescription
        },${this.datePipe.transform(item.startDateTime, 'dd/MM/yyyy')},${this.datePipe.transform(
          item.endDateTime,
          'dd/MM/yyyy',
        )},${item.totalDay},${item.totalHour > 0 ? this.datePipe.transform(item.startDateTime, 'shortTime') : ''
        },${item.totalHour > 0 ? this.datePipe.transform(item.endDateTime, 'shortTime') : ''},${item.totalHour
        },${item.leaveReason},${item.reviewerRemark},${item.status}\r\n`;
      // console.log(row);
      csvArray.push(row);
    }
    // console.log(csvArray)
    let fileName = `leave_report_${new Date().getTime()}.csv`;
    let data = {
      reportName: fileName,
      dateRange: `${this.datePipe.transform(
        this.startDate,
        'd MMMM y',
      )} to ${this.datePipe.transform(this.endDate, 'd MMMM y')}`,
      filters: {
        empoyeeTyeId: this.employeeType,
        'departmentId ': this.departmentId,
        leaveStatus: this.status,
      },
    };

    // console.log(data);
    this.authService.saveExportHistory(data).subscribe();
    var blob = new Blob(csvArray, { type: 'text/csv' });
    saveAs(blob, fileName);
  }

  openImageDialog(data: any) {
    // alert();
    // this.selectedImage = data;
    const dialogRef = this.dialog.open(ImagePreviewDialog, {
      width: 'auto',
      height: '35em',
      data: { selectedImage: data }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // this.router.navigate(['/registration/list']);
      // console.log('The dialog was closed');
    });
  }

  openFile(url: string) {

    window.open(url, '_blank');
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
