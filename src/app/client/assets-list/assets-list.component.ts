
import { Component, OnInit, TemplateRef } from '@angular/core';
import { OnChanges, SimpleChanges } from '@angular/core';
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
import { MatDialog } from '@angular/material/dialog';
import { B } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-assets-list',
  templateUrl: './assets-list.component.html',
  styleUrls: ['./assets-list.component.scss']
})
export class AssetsListComponent implements OnInit, OnChanges {
  globals: Globals;
  submitted: boolean = false;
  displayedColumns: string[] = [
    'assetNo',
    'assetName',
    'make',
    'model',
    'ownership',
    'class',
    'type',
    'location',
    'status'
    
  ];
  @ViewChild('employeeDetailDialog') employeeDetailDialog!: TemplateRef<any>;
  totalData: any = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  // dataSourceHistory: MatTableDataSource<any> = new MatTableDataSource<any>();

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator = Object.create(null);
  // @ViewChild(MatPaginator, { static: false }) paginatorHistory: MatPaginator = Object.create(null);

  @ViewChild(MatSort, { static: false }) sort: MatSort = Object.create(null);
  // @ViewChild(MatSort, { static: false }) sortHistory: MatSort = Object.create(null);
  // pagesize = 10;
  pageNo = 0;
  pageSize = 10;
  totalRecords: number = 0;
  search: string = ''; //by default 0 for pending list
  status: string = '';
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
  selectedRecord: any = {};
  constructor(
    private dialog: MatDialog,
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
    // this.authService.addedResigstration.subscribe((record: any) => {
    //   console.log(record, 'in listing12');
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
  }

  ngOnChanges(changes: SimpleChanges): void { }

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
    // console.log(elem);
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

    this.employeeService
      .employeeOnboardList(options)
      .pipe(first())
      .subscribe((result: any) => {
        let data: any = [];

        result.data = result.data.sort((x: any, y: any) => {
          let a: any = new Date(parseInt(y.registrationDate ? y.registrationDate : 0));
          let b: any = new Date(parseInt(x.registrationDate ? x.registrationDate : 0));
          console.log(y.registrationDate, a, b, x.registrationDate)
          return a - b;
        });

        // console.log(result.data.length, 'result.data.length')
        for (let i = 0; i < result.data.length; i++) {
          // let statusName = this.getStatus(result.data[i]?.status);
          let convertedRegistrationDate = this.datePipe.transform(result.data[i].registrationDate, 'dd/MM/yyyy');

          let convertedStartdDate = this.datePipe.transform(result.data[i].startdDate, 'dd/MM/yyyy');
          let convertedEndDate = this.datePipe.transform(result.data[i].endDate, 'dd/MM/yyyy');
          let employeeName = '';
          if (result.data[i].personal && result.data[i].personal != 'null') {
            employeeName = result.data[i] && result.data[i].personal ? `${result.data[i].personal.firstName} ${result.data[i].personal.lastName}` : '';
          } else {
            employeeName = result.data[i] && result.data[i].firstName ? `${result.data[i].firstName} ${result.data[i].lastName}` : '';

          }
          data.push({
            ...result.data[i],
            employeeName: employeeName,
            convertedEndDate: convertedEndDate,
            convertedStartdDate: convertedStartdDate,
            convertedRegistrationDate: convertedRegistrationDate,
            totalProgress: this.getProgressValue(result.data[i]),
            employeeEmail: (result.data[i] && result.data[i].personal ? result.data[i].personal.email : ''),
            employeePhone: (result.data[i] && result.data[i].personal ? result.data[i].personal.phone : '')
          });
        }

        // data.map((elem: any) => {
        //   return (elem.body.time = new Date(parseInt(elem.body.time)));
        // });

        // console.log(this.notifications, 'this.notifications');

        // if (isScrolled == true) {
        //   this.dataSource.data = [...this.dataSource.data, ...data];
        // } else {
        data = JSON.parse(JSON.stringify(data));
        this.totalData = data;
        this.totalRecords = this.totalData.length;
        let tempData = JSON.parse(JSON.stringify(data));
        // console.log(this.totalData, tempData, 'ndsnlkdn');

        this.dataSource.data = tempData.splice(0, 10);
        // }
      });
  }

  getDefaultOptions() {
    let obj = this.paginator;
    let sort = this.sort;
    let pageSize = obj != undefined ? (obj.pageIndex == null ? 1 : obj.pageIndex + 1) : 1;

    const options: ViewOptions = {
      sortField: sort !== undefined ? sort.active : 'convertedRegistrationDate',
      sortDirection: sort !== undefined ? sort.direction : 'desc',
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
    if (isTextSearch) {
      this.dataSource.filter = this.search;
    } else {
      let data = this.totalData;
      if (this.startDate && this.endDate) {
        console.log(data, 'asas');
        this.startDate = new Date(new Date(this.startDate).setHours(0, 0, 0, 0));
        this.endDate = new Date(new Date(this.endDate).setHours(23, 59, 59, 59));
        this.dataSource.data = data.filter((elem: any) => {
          let date: any = new Date(parseInt(elem.startdDate));
          date.setHours(0, 0, 0, 0);
          date = new Date(date);
          // console.log(this.startDate, this.endDate, date)
          return (date >= this.startDate && date <= this.endDate)
        });
        // console.log(this.status, this.endDate)

        this.dataSource.data = data.filter((elem: any) => {
          // console.log(elem.totalProgress,(this.status == 'all' || this.status == '' ? parseInt(elem.totalProgress) <= 100 : (this.status == 'pending' ? parseInt(elem.totalProgress) < 100 : parseInt(elem.totalProgress) == 100)),'asaskj')
          // return true;
          return (this.status == 'all' || this.status == '' ? parseInt(elem.totalProgress) <= 100 : (this.status == 'pending' ? parseInt(elem.totalProgress) < 100 : parseInt(elem.totalProgress) == 100));
          // return (date >= this.startDate && date <= this.endDate)
        });
      }
      // this.refresh(this.getDefaultOptions());
    }
  }

  onSubmit() {
    this.submitted = true;
    this.openDialog({});
    // if (this.form.invalid) {
    //   this.alertService.openSnackBar(CustomMessage.invalidForm);
    //   return;
    // }
  }

  openDialog(data: any) {
    this.selectedRecord = data;
    const dialogRef = this.dialog.open(this.employeeDetailDialog, {
      width: '40em',
      height: '35em',
      // data: { data: data },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // this.router.navigate(['/registration/list']);
      // console.log('The dialog was closed');
    });
  }

  getProgressValue(item: any) {
    // let totalFinal = 600;
    let currentProgress = 0;
    // console.log(item, 'item')

    if (item.banking != undefined && item.banking.completionProgress != "null") {
      currentProgress += item.banking.completionProgress ? parseFloat(item.banking.completionProgress) : 0;
    }
    // console.log(currentProgress, '1')

    if (item.emergency != undefined && item.emergency && item.emergency.completionProgress != "null") {
      currentProgress += item.emergency.completionProgress ? parseFloat(item.emergency.completionProgress) : 0;
    }


    // console.log(currentProgress, '2')

    if (item.licence != undefined && item.licence && item.licence.completionProgress != "null") {
      currentProgress += item.licence.completionProgress ? parseFloat(item.licence.completionProgress) : 0;
    }
    // console.log(item.licence, '3')


    if (item.personal != undefined && item.personal && item.personal.completionProgress != "null") {
      currentProgress += item.personal.completionProgress ? parseFloat(item.personal.completionProgress) : 0;
    }
    // console.log(currentProgress, '4')

    if (item.superannuation != undefined && item.superannuation && item.superannuation.completionProgress != "null") {
      currentProgress += item.superannuation.completionProgress ? parseFloat(item.superannuation.completionProgress) : 0;
    }
    // console.log(currentProgress, '5')


    if (item.tfn != undefined && item.tfn && item.tfn.completionProgress != "null") {
      currentProgress += item.tfn.completionProgress ? parseFloat(item.tfn.completionProgress) : 0;
    }

    // console.log(currentProgress, '6')

    if (item.membership != undefined && item.membership && item.membership.completionProgress != "null") {
      currentProgress += item.membership.completionProgress ? parseFloat(item.membership.completionProgress) : 0;
    }

    // console.log(currentProgress, '7')


    let final = (currentProgress / 700) * 100;
    return Math.ceil(final);
    // console.log(final);
  }

  getColor(type: String) {
    let item: any = this.selectedRecord;
    let progress: any = 0;
    switch (type) {
      case 'personal':
        progress = item && item.personal != undefined && item.personal.completionProgress != undefined ? item.personal.completionProgress : 0;
        break;
      case 'banking':
        progress = item && item.banking != undefined && item.banking.completionProgress != undefined ? item.banking.completionProgress : 0;
        break;
      case 'emergency':
        progress = item && item.emergency != undefined && item.emergency.completionProgress != undefined ? item.emergency.completionProgress : 0;
        break;
      case 'tfn':
        progress = item && item.tfn != undefined && item.tfn.completionProgress != undefined ? item.tfn.completionProgress : 0;
        break;
      case 'superannuation':
        progress = item && item.superannuation != undefined && item.superannuation.completionProgress != undefined ? item.superannuation.completionProgress : 0;
        break;
      case 'licence':
        progress = item && item.licence != undefined && item.licence.completionProgress != undefined ? item.licence.completionProgress : 0;
        break;
      case 'membership':
        progress = item && item.membership != undefined && item.membership.completionProgress != undefined ? item.membership.completionProgress : 0;
        break;
      case 'total':
        progress = this.getProgressValue(this.selectedRecord);
        break;

      default:
        break;
    }
    let className = 'warn';
    if (progress == '100') {
      className = 'accent';
    } else if (progress > 0 && progress < 100) {
      className = 'primary';
    }
    return className;
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
      // console.log(this.dataSource.data.length, this.totalRecords, 'totalRecords');
      if (this.dataSource.data && (this.dataSource.data.length < this.totalRecords)) {
        this.pageSize = this.pageSize + 10;
        // this.paginator.pageSize = this.pageSize;
        // console.log(this.totalData, this.pageSize);
        let tempData = this.totalData;
        this.dataSource.data = tempData.splice(0, this.pageSize);
        // this.refresh(this.getDefaultOptions(), true);
      }
      // this.dataSource = this.dataSource.concat(ELEMENT_DATA);
    }
  }

  exportCsv() {
    // const replacer = (key:any, value:any) => value === null ? '' : value; // specify how you want to handle null values here
    // const header = Object.keys(this.displayedColumns);
    // let csv = this.dataSource.data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    // csv.unshift(header.join(','));
    // let csvArray = csv.join('\r\n');
    let csvArray: any = [
      'Employee Name,Employee No,Email,Phone,DOB,Gender,Temporary Address,Permanent Address,Licence Number,Licence Issued at,Licence Expiry,Emergency Contact Person,Emergency Email, Emergency Contact No,Emergency Contact Address,Tfn Number,Annutation CurrentFund Account Name,Annutation CurrentFund Member Name,Bank Holder Name, Bank Ac No, Bank Name,Bank BSB no,Bank Fixed Amount,Registration Date,Start Date,End Date\r\n',
    ];
    for (let i = 0; i < this.dataSource.data.length; i++) {
      let item = this.dataSource.data[i];
      // console.log(this.dataSource.data[i], 'this.dataSource.data');
      let row: string = `${item?.employeeName},${item?.personal?.employeeNo},${item?.personal?.email},${item?.personal?.phone},${item?.personal?.birthdate},${item?.personal?.gender},${item?.personal?.tempAddress?.address} ${item?.personal?.tempAddress?.suburb} ${item?.personal?.tempAddress?.state} ${item?.personal?.tempAddress?.postcode},${item?.personal?.permanentAddress?.address} ${item?.personal?.permanentAddress?.suburb} ${item?.personal?.permanentAddress?.state} ${item?.personal?.permanentAddress?.postcode},${item?.licence?.licenceNumber},${item?.licence?.issuedIn},${item?.licence?.expiryDate},${item?.emergency?.firstName} ${item?.emergency?.lastName},${item?.emergency?.email},${item?.emergency?.mobile},${item?.emergency?.address?.address} ${item?.emergency?.address?.suburb} ${item?.emergency?.address?.state} ${item?.emergency?.address?.postcode},${item?.tfn?.tfnnumber},${item?.superannuation?.currentFund?.accountName},${item?.superannuation?.currentFund?.membername},${item?.banking?.defaultBank?.accountHolderName},${item?.banking?.defaultBank?.accountNumber},${item?.banking?.defaultBank?.bankName},${item?.banking?.defaultBank?.bsbNumber},${item?.banking?.defaultBank?.fixedAmount},${item?.convertedRegistrationDate},${item?.convertedStartdDate},${item?.convertedEndDate}\r\n`;
      // console.log(row);
      csvArray.push(row);
    }
    // console.log(csvArray)
    let fileName = `oboarding_report_${new Date().getTime()}.csv`;
    // let data = {
    //   reportName: fileName,
    //   dateRange: `${this.datePipe.transform(
    //     this.startDate,
    //     'd MMMM y',
    //   )} to ${this.datePipe.transform(this.endDate, 'd MMMM y')}`,
    //   filters: {
    //     empoyeeTyeId: this.employeeType,
    //     'departmentId ': this.departmentId,
    //     leaveStatus: this.status,
    //   },
    // };

    // console.log(data);
    // this.authService.saveExportHistory(data).subscribe();
    var blob = new Blob(csvArray, { type: 'text/csv' });
    saveAs(blob, fileName);
  }
}
