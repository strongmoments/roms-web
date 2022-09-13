import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { first } from 'rxjs';
import { AlertService } from 'src/app/core/services';
import { LeaveService } from 'src/app/core/services/leave.service';
import { Utils } from 'src/app/core/_helpers/util';
import { CustomMessage } from 'src/app/custom-message';
import { Globals } from 'src/app/globals';
import { ViewOptions } from 'src/app/_models';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-leave-request-list',
  templateUrl: './leave-request-list.component.html',
  styleUrls: ['./leave-request-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class LeaveRequestListComponent implements OnInit, AfterViewInit {
  globals: Globals;
  // leaveHours: number = 0;
  // form: FormGroup;
  submitted: boolean = false;
  displayedColumnsLeave: string[] = [
    'staffName',
    'applyDate',
    'leave_type',
    'dates',
    'days',
    'time',
    'hours',
    'leaveReason',
    'action',
  ];
  displayedColumnsHistory: string[] = [
    'staffName',
    'applyDate',
    'leave_type',
    'dates',
    'days',
    'time',
    'hours',
    'leaveReason',
  ];
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>();
  selectedTabIndex: number = 0;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  // @ViewChild('MatPaginator1') paginator1!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  pagesize = 10;
  pageNo = 0;
  pageSize = 10;
  totalRecords: number = 0;
  search: string = '1'; //by default 0 for pending list
  comments: any = [];
  currentDate: any = new Date();
  expandedElement: any = null;
  selectedId: any;
  tabIndex: number = 0;
  startDate: Date = new Date(new Date().setMonth(new Date().getMonth() - 1));
  endDate: Date = new Date();

  constructor(
    public util: Utils,
    globals: Globals,
    private fb: FormBuilder,
    private alertService: AlertService,
    private leaveService: LeaveService,
    private datePipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.globals = globals;
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams['id']) {
        this.selectedId = queryParams['id'];
        // this.onTabChanged(1);
      }
    });
  }

  ngAfterViewInit() {
    // this..paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    // this.paginator.page.subscribe((page: PageEvent) => {
    //     console.log('test')
    //     this.refresh(this.getDefaultOptions());
    // });

    // this.dataSource.sort = this.sort;
    this.sort.sortChange.subscribe((sort) => {
      this.refresh(this.getDefaultOptions());
    });
  }

  handlePageChange(event: any) {
    console.log(event);
    this.pageNo = event.pageIndex && event.pageIndex > 0 ? event.pageIndex : 0;
    this.pageSize = event.pageSize;
    if (this.selectedTabIndex == 1) {
      this.historyList();
    } else {
      this.refresh(this.getDefaultOptions());
    }
  }
  // F

  convertTimeMoment(value: any, format: string) {
    try {
      return moment(value).utc().format(format);
    } catch (e) {
      return;
    }
  }

  ngOnInit(): void {
    this.displayedColumns = this.displayedColumnsLeave;
    this.refresh(this.getDefaultOptions());
  }

  onTabChanged(index: number) {
    this.tabIndex = index;
    this.dataSource.data = [];
    this.totalRecords = 0;
    this.paginator.pageIndex = 0;
    this.pageNo = 0;
    this.pageSize = 10;
    this.search = index == 0 ? '1' : '0';
    this.selectedTabIndex = index;
    this.displayedColumns = index == 0 ? this.displayedColumnsLeave : this.displayedColumnsHistory;
    // console.log(event, 'event')

    if (index == 1) {
      this.historyList();
    } else {
      // if (this.paginator) {

      //     this.paginator.pageIndex = 0;

      //     // this.dataSource.paginator = this.paginator;
      // }
      this.refresh(this.getDefaultOptions());
    }
  }

  historyList() {
    if (this.selectedTabIndex == 1) {
      this.totalRecords = 0;
      this.dataSource.data = [];
      // this.search = '2';
      this.refresh2(this.getDefaultOptions());
      // this.search = '3';
      // this.refresh2(this.getDefaultOptions());
    }
  }

  refresh2(options: ViewOptions) {
    this.leaveService
      .staffLeaveHistory(options)
      .pipe(first())
      .subscribe((result: any) => {
        console.log(result, 'result');
        this.totalRecords += result.totalElement;
        this.dataSource.data = [...result.data, ...this.dataSource.data];
        console.log(this.dataSource.data, 'result.data');
        this.comments = [];
        this.dataSource.data.map(() => {
          this.comments.push('');
        });
      });
  }

  refresh(options: ViewOptions) {
    this.leaveService
      .staffLeavePending(options)
      .pipe(first())
      .subscribe((result: any) => {
        this.totalRecords = result.totalElement;
        this.dataSource.data = result.data;
        let selected = this.dataSource.data.find((elem: any) => {
          return elem.id == this.selectedId;
        });
        if (selected) {
          this.expandedElement = selected;
        }
        console.log(this.totalRecords, 'result.data');
        this.comments = [];
        result.data.map(() => {
          this.comments.push('');
        });
      });
  }

  getDefaultOptions() {
    // let obj: any;
    // if (this.selectedTabIndex == 0) {
    //     obj = this.paginator;
    // } else {
    //     obj = this.paginator1;
    // }
    let sort = this.sort;
    // let pageSize = (obj != undefined ? (obj.pageIndex == null ? 1 : obj.pageIndex + 1) : 1);
    // console.warn(obj.pageIndex)
    const options: ViewOptions = {
      sortField: sort !== undefined ? sort.active : 'fullName',
      sortDirection: sort !== undefined ? sort.direction : 'asc',
      page: this.pageNo,
      search: this.search,
      query: '',
      pageSize: this.pageSize > 0 ? this.pageSize : this.pagesize,
    };
    return options;
  }

  calculateDays(startDay: any, endDay: any) {
    let days = 0;
    // console.log('sads', startDay, endDay)
    if (startDay && endDay) {
      var date1 = new Date(startDay);
      var date2 = new Date(endDay);

      // To calculate the time difference of two dates
      var Difference_In_Time = date2.getTime() - date1.getTime();
      // To calculate the no. of days between two dates
      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
      // console.log(startDay, endDay, endDay < startDay)
      days = Math.round(Difference_In_Days);
      days = days == 0 ? 1 : days;
    } else {
      days = 0;
    }
    return days;
  }

  getStatus(status: any) {
    return this.globals.leaveStatus.find((elem: any) => {
      return elem.value == status;
    })?.name;
  }

  getStatusColor(status: any) {
    return this.globals.leaveStatus.find((elem: any) => {
      return elem.value == status;
    })?.colorClass;
  }

  getShortDate(startDate: any, endDate: any) {
    let dateLabel = '';
    if (startDate && endDate) {
      startDate = new Date(startDate);
      endDate = new Date(endDate);
      let today = new Date();
      var startDateDiff = (startDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
      startDateDiff = Math.round(startDateDiff);
      var endDateDiff = (endDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
      endDateDiff = Math.round(endDateDiff);

      if (startDate) {
      }
      console.log(startDate, 'startDate');
    } else {
      return dateLabel;
    }
  }

  addComment(index: number, event: any) {
    if (this.comments && this.comments.length > 0) {
      this.comments[index] = event.target.value;
    }
  }

  approveReject(type: number, index: number, id: any) {
    //         if (index && this.comments && this.comments.length > 0 && (this.comments[index] != undefined || this.comments[index] != '')) {

    //         } else {
    // this.alertService.openSnackBar(CustomMessage.error)
    //         }
    if (type == 0) {
      this.leaveService
        .approveLeave({ id: id, reviewerRemark: this.comments[index] ? this.comments[index] : '' })
        .subscribe(
          (res) => {
            this.alertService.openSnackBar(CustomMessage.leaveAccepted, false);
            this.refresh(this.getDefaultOptions());
            // this.router.navigate(['/dashboard']);
          },
          (error) => {
            this.alertService.openSnackBar(CustomMessage.error);
          },
        );
    } else if (type == 1) {
      this.leaveService
        .rejectLeave({ id: id, reviewerRemark: this.comments[index] ? this.comments[index] : '' })
        .subscribe(
          (res) => {
            this.alertService.openSnackBar(CustomMessage.leaveRejected, false);
            this.refresh(this.getDefaultOptions());
            // this.router.navigate(['/dashboard']);
          },
          (error) => {
            this.alertService.openSnackBar(CustomMessage.error);
          },
        );
    }
  }
}
