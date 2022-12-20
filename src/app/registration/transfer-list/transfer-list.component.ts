import { Component, OnChanges, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
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
import { AlertService, JobService } from 'src/app/core/services';
import { LeaveService } from 'src/app/core/services/leave.service';
import { Utils } from 'src/app/core/_helpers/util';
import { Globals } from 'src/app/globals';
import { ViewOptions } from 'src/app/_models';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { element } from 'protractor';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-transfer-list',
  templateUrl: './transfer-list.component.html',
  styleUrls: ['./transfer-list.component.scss'],
})
export class TransferListComponent implements OnInit, OnChanges {
  globals: Globals;
  submitted: boolean = false;
  displayedColumns: string[] = [
    'select',
    'demandNo',
    'employeeName',
    'requestedDate',
    'hiringManager',
    'fromProject',
    'fromGang',
    'fromWage',
    'fromRate',
    'toProject',
    'toGang',
    'toWage',
    'toRate',
    'createdDate',
    'approvedDate',
    'recommendedBy',    
    'approver',
  ];

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  // dataSourceHistory: MatTableDataSource<any> = new MatTableDataSource<any>();

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator = Object.create(null);
  // @ViewChild(MatPaginator, { static: false }) paginatorHistory: MatPaginator = Object.create(null);

  //@ViewChild(MatSort, { static: false }) sort: MatSort = Object.create(null);
  @ViewChild(MatSort, { static: false }) sort: MatSort = Object.create(null);

  @ViewChild('confirmationDialog') confirmationDialog!: TemplateRef<any>;
  // @ViewChild(MatSort, { static: false }) sortHistory: MatSort = Object.create(null);
  // pagesize = 10;
  pageNo = 0;
  pageSize = 9999999999;
  totalRecords: number = 0;
  search: string = ''; //by default 0 for pending list
  startDate: Date = new Date(new Date().setMonth(new Date().getMonth() - 1));
  endDate: Date = new Date(new Date().setDate(new Date().getDate() + 1));
  removedRows: any = [];
  // selectedTabIndex: number = 0;
  selectedId: string = '';
  dialogData : any;
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
    private jobService: JobService,
    private router: Router,
    private dialog: MatDialog
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
    //this.refresh(this.getDefaultOptions());
    // console.log('in listing');
    // this.authService.addedResigstration.subscribe((record: any) => (this.dataSource.data.unshift(record)));
    // this.authService.addedResigstration.subscribe((record: any) => {
    //   if (record) {
    //     this.totalRecords = this.totalRecords + 1;
    //     record.statusName = this.getStatus(record?.status);
    //     record.convertedAppliedOn = this.datePipe.transform(record.appliedOn, 'dd/MM/yyyy');
    //     // data.push({
    //     //   ...record,
    //     //   statusName: statusName,
    //     //   convertedAppliedOn: convertedAppliedOn
    //     // });

    //     this.dataSource.data = [record, ...this.dataSource.data];
    //   }
    // });

    this.refresh(this.getDefaultOptions());
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource.sort = this.sort
  }

  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit(): void {
    //this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    this.dataSource.sort = this.sort;
    this.paginator?.page.subscribe((page: PageEvent) => {
      this.refresh(this.getDefaultOptions());
    });
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

    let startDate = this.startDate
      ? moment(new Date(new Date(this.startDate).setHours(0, 0, 0, 0)).toUTCString()).format('DD-MM-yyyy')
      : '';
    let endDate = this.endDate
      ? moment(new Date(new Date(this.endDate).setHours(23, 59, 59, 59)).toUTCString()).format('DD-MM-yyyy')
      : '';

    let queryData = {
      toDate: endDate,
      fromDate: startDate,
      searchText: `${this.search}`,
    };

    this.jobService.getapprovedTransferList(this.getDefaultOptions(), queryData).pipe(first()).subscribe((result: any) => {
      this.totalRecords = result.totalElement;
        let data: any = [];
        for (let i = 0; i < result.data.length; i++) {

          let demandId = result.data[i]?.recommendDetails?.demandIdx?.demandId;
          let employeeName = `${result.data[i].recommendDetails.employeeIdx.firstName},${result.data[i].recommendDetails.employeeIdx.lastName}`;
          let createdDate = result.data[i]?.recommendDetails?.createDate;
          let requestedDate = result.data[i]?.recommendDetails?.requestedDate;
          let approvedDate = result.data[i]?.recommendDetails?.lastUpdateDate;
          data.push({
            ...result.data[i],
            demandNo: demandId,
            employeeName: employeeName,
            createdDate: createdDate,
            requestedDate: requestedDate,
            approvedDate: approvedDate
          });
        }

        this.dataSource.data = data;
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
  // getapprovedTransferList() {
  //   this.jobService.getapprovedTransferList(this.getDefaultOptions()).subscribe((result: any) => {
  //     this.dataSource.data = result.data;
  //     this.dataSource.sort = this.sort;
  //   });
  // }

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

  approveRejectBilling(event: MatCheckboxChange, row: any){
    console.log('Selected:',event,' Row:',row);
    //event.checked = false;
    //event.checked=false;
    //row.recommendDetails.externalSystemEntry = true;
    this.dialogData = row;
    this.openDialog();
  }

  approveReject(){
    this.approveRejectDemand();
  }
  
  openDialog() {
    const dialogRef = this.dialog.open(this.confirmationDialog, {
      width: '30em',
      height: '15em',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // this.router.navigate(['/registration/list']);
      console.log('The dialog was closed');
    });
  }

  approveRejectDemand() {
  let payload = {
    "id" : this.dialogData.recommendDetails.id,
    "externalSystemEntry" : !this.dialogData.recommendDetails.externalSystemEntry
  }
    this.jobService.approveRejectTransfer(payload).subscribe((result: any) => {
      this.dataSource.data = result.data;
      this.dialogData.recommendDetails.externalSystemEntry = !this.dialogData.recommendDetails.externalSystemEntry;
      this.cancel();
      this.refresh(this.getDefaultOptions());
    });
  }

  cancel(){
    this.dialog.closeAll();
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

  exportCsv() {
    let csvArray: any = [
      'Demand ID,Emp Name,Date Effective,Hiring Manager,From Project,From Gang,From Wage,From Rate,To Project,To Gang,To Wage,To Rate,Date Created,Approved On,Recommended By,Approver\r\n',
    ];
    for (let i = 0; i < this.dataSource.data.length; i++) {
      let item = this.dataSource.data[i];
      // console.log(this.dataSource.data[i], 'this.dataSource.data');
      let row: string = `${item?.demandNo},${item?.recommendDetails.employeeIdx.firstName} ${item?.recommendDetails.employeeIdx.lastName
      },${this.datePipe.transform(item.requestedDate, 'dd/MM/yyyy')},${item?.recommendDetails?.demandIdx?.hiringManager?.firstName
      } ${item?.recommendDetails?.demandIdx?.hiringManager?.lastName
      },${item?.recommendDetails?.fromSubteamIdx?.clientProject?.name
      },${item?.recommendDetails?.fromSubteamIdx?.teamName},${item?.recommendDetails?.fromSubteamIdx?.wageClassification
      },${item?.recommendDetails?.fromSubteamIdx?.rate},${item?.recommendDetails?.toSubteamIdx?.clientProject?.name
      },${item?.recommendDetails?.toSubteamIdx?.teamName},${item?.recommendDetails?.toSubteamIdx?.wageClassification
      },${item?.recommendDetails?.toSubteamIdx?.rate},${this.datePipe.transform(item.createdDate, 'dd/MM/yyyy')
    },${this.datePipe.transform(item.approvedDate, 'dd/MM/yyyy')
  },${item?.recommendDetails?.initiatedBy?.firstName} ${item?.recommendDetails?.initiatedBy?.lastName
  },${item?.recommendDetails?.acceptedBy?.firstName} ${item?.recommendDetails?.acceptedBy?.lastName}\r\n`;
      // console.log(row);
      csvArray.push(row);
    }
    // console.log(csvArray)
    let fileName = `transfer_list_${new Date().getTime()}.csv`;

    var blob = new Blob(csvArray, { type: 'text/csv' });
    saveAs(blob, fileName);
  }
}
