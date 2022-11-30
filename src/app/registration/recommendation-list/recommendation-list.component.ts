import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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

@Component({
  selector: 'app-recommendation-list',
  templateUrl: './recommendation-list.component.html',
  styleUrls: ['./recommendation-list.component.scss'],
})
export class RecommendationListComponent implements OnInit, OnChanges {
  globals: Globals;
  submitted: boolean = false;
  displayedColumns: string[] = [
    'demandNo',
    'project',
    'location',
    'gang',
    'classification',
    'rate',
    'contract',
    'currentSuper',
    'name',
    'no',
    'action',
  ];

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  // dataSourceHistory: MatTableDataSource<any> = new MatTableDataSource<any>();

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator = Object.create(null);
  // @ViewChild(MatPaginator, { static: false }) paginatorHistory: MatPaginator = Object.create(null);

  @ViewChild(MatSort, { static: false }) sort: MatSort = Object.create(null);
  // @ViewChild(MatSort, { static: false }) sortHistory: MatSort = Object.create(null);
  // pagesize = 10;
  pageNo = 0;
  pageSize = 9999999999;
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
    private employeeService: EmployeeService,
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
    // this.authService.getAllEmployeeType().subscribe((result: any) => {
    //   this.employeeTypeList = result && result.data && result.data.length > 0 ? result.data : [];
    // });

    // this.authService.getAllDepartmentType().subscribe((result: any) => {
    //   this.departmentList = result && result.data && result.data.length > 0 ? result.data : [];
    // });
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
    // console.log('in listing');
    // this.authService.addedResigstration.subscribe((record: any) => (this.dataSource.data.unshift(record)));
    this.authService.addedResigstration.subscribe((record: any) => {
      console.log(record, 'in listing12');
      if (record) {
        this.totalRecords = this.totalRecords + 1;
        record.statusName = this.getStatus(record?.status);
        record.convertedAppliedOn = this.datePipe.transform(record.appliedOn, 'dd/MM/yyyy');
        // data.push({
        //   ...record,
        //   statusName: statusName,
        //   convertedAppliedOn: convertedAppliedOn
        // });

        this.dataSource.data = [record, ...this.dataSource.data];
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {}

  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    this.dataSource.sort = this.sort;
    // this.paginator?.page.subscribe((page: PageEvent) => {
    //   if (this.selectedTabIndex == 0) {
    //   }
    // });
  }

  redirectForm(elem: any) {
    console.log(elem);
    sessionStorage.setItem(elem.id, JSON.stringify(elem));
    this.router.navigate(['/registration/create-user'], { queryParams: { requestId: elem.id } });
  }

  // onTableScroll(e: any) {
  //   const tableViewHeight = e.target.offsetHeight; // viewport: ~500px
  //   const tableScrollHeight = e.target.scrollHeight; // length of all table
  //   const scrollLocation = e.target.scrollTop; // how far user scrolled

  //   // If the user has scrolled within 200px of the bottom, add more data
  //   const buffer = 10;
  //   const limit = tableScrollHeight - tableViewHeight - buffer;
  //   console.log(scrollLocation, limit, 'scrollLocation > limit');
  //   if (scrollLocation > limit) {
  //     if (this.dataSource.data.length < this.totalRecords) {
  //       this.pageNo = this.pageNo + 1;
  //       this.refresh(this.getDefaultOptions(), true);
  //     }
  //     // this.dataSource = this.dataSource.concat(ELEMENT_DATA);
  //   }
  // }

  refresh(options: ViewOptions, isScrolled: boolean = false) {
    // let startDate = this.startDate
    //   ? moment(new Date(this.startDate).toUTCString()).format('DD-MM-YYYY')
    //   : '';
    // let endDate = this.endDate
    //   ? moment(new Date(this.endDate).toUTCString()).format('DD-MM-YYYY')
    //   : '';

    // let queryData = {
    //   toDate: endDate,
    //   fromDate: startDate,
    //   departmentId: this.departmentId == 'all' ? '' : this.departmentId,
    //   employeeTypeId: this.employeeType == 'all' ? '' : this.employeeType,
    //   status: `${this.status}`,
    // };
    // console.log(queryData, 'queryData');

    this.authService
      .getAllEmployeeRegisterReq()
      .pipe(first())
      .subscribe((result: any) => {
        this.totalRecords = result.data.length;
        let data: any = [];
        result.data = result.data.sort((a: any, b: any) => {
          return a.status - b.status;
        });
        result.data = result.data.sort((a: any, b: any) => {
          var c: any = new Date(parseInt(a.appliedOn));
          var d: any = new Date(parseInt(b.appliedOn));
          // console.log(a,d);
          return d - c;
        });

        for (let i = 0; i < result.data.length; i++) {
          let statusName = this.getStatus(result.data[i]?.status);
          let convertedAppliedOn = this.datePipe.transform(result.data[i].appliedOn, 'dd/MM/yyyy');
          data.push({
            ...result.data[i],
            statusName: statusName,
            convertedAppliedOn: convertedAppliedOn,
          });
        }
        // if (isScrolled == true) {
        //   this.dataSource.data = [...this.dataSource.data, ...data];
        // } else {
        this.dataSource.data = data;
        // }
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
        obj != undefined ? (obj.pageSize == null ? this.pageSize : obj.pageSize) : this.pageSize,
    };
    return options;
  }

  getStatus(status: any) {
    return this.globals.userApplicationStatus.find((elem: any) => {
      return elem.value == status;
    })?.name;
  }

  getStatusColor(status: any, isCheckbox: boolean = false) {
    let elem: any = this.globals.userApplicationStatus.find((elem: any) => {
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
      this.refresh(this.getDefaultOptions());
    }
  }
}
