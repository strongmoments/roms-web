import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { AlertService } from 'src/app/core/services';
import { LeaveService } from 'src/app/core/services/leave.service';
import { Utils } from 'src/app/core/_helpers/util';
import { CustomMessage } from 'src/app/custom-message';
import { Globals } from 'src/app/globals';
import { ViewOptions } from 'src/app/_models';
import * as moment from 'moment';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { E } from '@angular/cdk/keycodes';
import { ImagePreviewDialog } from 'src/app/shared/image-preview-dialog/image-preview-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-leave-apply-form',
  templateUrl: './leave-apply-form.component.html',
  styleUrls: ['./leave-apply-form.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class LeaveApplyFormComponent implements OnInit {
  globals: Globals;
  leaveHours: number = 0;
  leaveDays: number = 0;
  form: FormGroup;
  submitted: boolean = false;
  displayedColumns: string[] = ['applyDate', 'leave_type', 'dates', 'days', 'time', 'hours', 'manager', 'status'];
  dataSource = new MatTableDataSource<any>();
  pagesize = 10;
  totalRecords: number = 0;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  historyMonth!: string;
  leaveTypeList: any = [];
  availableLeaveCount: number = 0;
  selectedLeaveType: string = '';
  managerData: any = {};
  isTimeInputDisabled: boolean = false;
  minDate: Date = new Date(new Date().setMonth(new Date().getMonth() - 2));
  maxDate: Date = new Date(new Date().setMonth(new Date().getMonth() + 12));
  classArray = ['custom-button-grey', 'custom-button-light-grey', 'custom-button-purple', 'custom-button-light-pink', 'custom-button-light-green', 'custom-button-grey', 'custom-button-light-blue', 'custom-button-light-blue-1', 'custom-button-brown'];
  currentDate: any = new Date();
  isFriday: string = this.currentDate.getDay();
  // columnsToDisplay: string[] = ['leaveReason', 'reviewerRemark'];
  expandedElement: any = null;
  tabIndex: number = 0;
  selectedId: any;
  attachments: any = [];
  attachmentFiles: any = [];
  constructor(private dialog: MatDialog, public util: Utils, globals: Globals, private fb: FormBuilder, private alertService: AlertService, private leaveService: LeaveService, private router: Router, private activatedRoute: ActivatedRoute) {
    // console.log(this.minDate, this.maxDate)
    this.globals = globals;
    this.form = this.fb.group({
      startDate: new FormControl(new Date(), [Validators.required]),
      endDate: new FormControl(new Date(), [Validators.required]),
      startTime: new FormControl('', []),
      endTime: new FormControl('', []),
      leaveDays: new FormControl('1', [Validators.required, Validators.pattern(this.util.intRegex)]),
      leaveType: new FormControl('', [Validators.required]),
      leaveReason: new FormControl('', []),
    });


    this.leaveService.getLeaveTypes().subscribe((res) => {
      this.leaveTypeList = res && res.data ? res.data : [];
      this.selectedLeaveType = this.leaveTypeList && this.leaveTypeList.length > 0 ? this.leaveTypeList[0].id : '';
      this.form.controls['leaveType'].setValue(this.selectedLeaveType);

      // console.log(res)
    });
    this.leaveService.getManager().subscribe((res) => {
      this.managerData = res;
      // console.log(res, 's');
    });

    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.activatedRoute.queryParams.subscribe(queryParams => {
      if (queryParams['id']) {
        this.selectedId = queryParams['id'];
        this.onTabChanged(1);
      }
    });
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator.page.subscribe((page: PageEvent) => {
      this.refresh(this.getDefaultOptions());
    });
  }

  get f() {
    return this.form.controls;
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.form.controls[controlName].hasError(errorName);
  };

  convertTimeMoment(value: any, format: string) {
    try {
      return moment(value).utc().format(format);
    } catch (e) {
      return;
    }
  }
  ngOnInit(): void { }

  checkLeaveDays(event: any) {
    let startDay = this.form.controls['startDate'].value;
    let endDay = this.form.controls['endDate'].value;
    // this.isTimeInputDisabled = false;

    // this.form.controls['leaveDays'].setValue(0);
    // this.leaveDays = 0;
    // console.log('sads', startDay, endDay);
    if (startDay && endDay) {
      var date1 = new Date(startDay);
      var date2 = new Date(endDay);

      // To calculate the time difference of two dates
      var Difference_In_Time = date2.getTime() - date1.getTime();

      // To calculate the no. of days between two dates
      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
      // console.log(Difference_In_Days, 'Difference_In_Days')
      let dayDifference = Math.round(Difference_In_Days);

      let startTime = (this.form.controls['startTime'].value);
      let endTime = (this.form.controls['endTime'].value);
      if (!startTime && !endTime && dayDifference == 0) {
        dayDifference = 1;
      }
      if (dayDifference >= event.target.value) {
        this.leaveDays = event.target.value;
      } else {

        this.form.controls['leaveDays'].setValue(0);
        this.leaveDays = 0;
        this.alertService.openSnackBar(`You can not enter days more than ${dayDifference} days`);
        return;
      }
    }
    // console.log(event)
  }

  setLeaveType(data: any) {
    this.selectedLeaveType = data.id;
    this.availableLeaveCount = data.numberDaysAllowed;
    this.form.controls['leaveType'].setValue(data.id);
  }

  calculateHoursByField() {
    let startTime = this.form.controls['startTime'].value;
    let endTime = this.form.controls['endTime'].value;
    // console.log(startTime, endTime, endTime < startTime);

    if (this.isTimeInputDisabled) {
      this.form.controls['startTime'].setValue('');
      this.form.controls['endTime'].setValue('');
      this.alertService.openSnackBar(CustomMessage.timeWarningWithDate);
      return;
    }
    let regex = /^(0[0]|0[0]):[0-5][0-9]$/;
    if (startTime != '' && regex.test(startTime) == true) {
      startTime = 0;
    }
    if (endTime != '' && regex.test(endTime) == true) {
      endTime = 0;
    }
    startTime = parseInt(startTime);
    endTime = parseInt(endTime);
    if ((startTime || startTime == 0) && (endTime || endTime == 0)) {
      // console.log(startTime, endTime, endTime < startTime);
      if (endTime < startTime) {
        // if ((endTime - startTime + 24) > 4) {

        //     // this.alertService.openSnackBar(CustomMessage.maxShiftTimeWarning);
        // } else {
        this.leaveHours = 24 - (startTime - endTime);
        // }
      } else {
        this.leaveHours = endTime - startTime;
      }

      if (this.leaveHours > 4) {
        this.form.controls['endTime'].setValue('');
        this.leaveHours = 0;
        this.form.controls['leaveDays'].setValue(1);
        this.leaveDays = 1;
        this.alertService.openSnackBar(CustomMessage.maxShiftTimeWarning);
      }
      this.form.controls['leaveDays'].setValue(0);
      this.leaveDays = 0;
    } else {
      this.form.controls['leaveDays'].setValue(1);
      this.leaveDays = 1;
      this.leaveHours = 0;
    }

    return;
  }

  calculateDate(value: string) {
    // console.log((value), 'parseInt(value)');
    let startDay = this.form.controls['startDate'].value;
    let endDay = this.form.controls['endDate'].value;
    this.isTimeInputDisabled = false;
    let currentDate = new Date(new Date().getTime());
    let leaveDays = 1;
    if (this.form.controls['startTime'].value != '' || this.form.controls['endTime'].value != '') {
      leaveDays = 0;
    }
    if (value == 'fri') {
      // console.log(currentDate.getDay());
      let nextFriday = new Date();
      if (currentDate.getDay() == 5) {
        nextFriday = currentDate;
      } else {
        nextFriday = new Date(
          currentDate.setDate(currentDate.getDate() + ((4 - currentDate.getDay() + 1) % 7 || 7)),
        );
      }
      this.form.controls['startDate'].setValue(nextFriday);
      this.form.controls['endDate'].setValue(nextFriday);

      this.form.controls['leaveDays'].setValue(leaveDays);
      this.leaveDays = leaveDays;
    } else if (value == 'mon') {
      const nextMonday = new Date(
        currentDate.setDate(currentDate.getDate() + ((7 - currentDate.getDay() + 1) % 7 || 7)),
      );
      // console.log(currentDate, 'nextMonday');
      this.form.controls['startDate'].setValue(nextMonday);
      this.form.controls['endDate'].setValue(nextMonday);

      this.form.controls['leaveDays'].setValue(leaveDays);
      this.leaveDays = leaveDays;
    } else if (value == '-1' || value == '1' || value == '0' || value == '2') {
      // console.log(currentDate, parseInt(value), 'parseInt(value)');
      currentDate.setDate(currentDate.getDate() + parseInt(value));
      this.form.controls['startDate'].setValue(currentDate);
      this.form.controls['endDate'].setValue(currentDate);

      this.form.controls['leaveDays'].setValue(leaveDays);
      this.leaveDays = leaveDays;
    }
    return;
  }

  calculateDaysByField() {
    let startDay = this.form.controls['startDate'].value;
    let endDay = this.form.controls['endDate'].value;
    this.isTimeInputDisabled = false;

    this.form.controls['leaveDays'].setValue(0);
    this.leaveDays = 0;
    // console.log('sads', startDay, endDay);
    if (startDay && endDay) {
      var date1 = new Date(startDay);
      var date2 = new Date(endDay);

      // To calculate the time difference of two dates
      var Difference_In_Time = date2.getTime() - date1.getTime();

      // To calculate the no. of days between two dates
      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
      // console.log(,'Difference_In_Days')

      let dayDifference = Math.round(Difference_In_Days);
      if (dayDifference > 0) {
        this.form.controls['leaveDays'].setValue(dayDifference);
        this.leaveDays = dayDifference;
        this.isTimeInputDisabled = true;

        if (
          this.form.controls['startTime'].value != '' ||
          this.form.controls['endTime'].value != ''
        ) {
          this.form.controls['startTime'].setValue('');
          this.form.controls['endTime'].setValue('');
          this.leaveHours = 0;
          this.alertService.openSnackBar(CustomMessage.dateWarningWithTime);
        }
      } else {
        this.form.controls['leaveDays'].setValue(dayDifference);

        this.leaveDays = dayDifference;
      }
    }
    return;
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

  calculateHours(value: number) {
    if (this.isTimeInputDisabled) {
      this.form.controls['startTime'].setValue('');
      this.form.controls['endTime'].setValue('');
      this.alertService.openSnackBar(CustomMessage.timeWarningWithDate);
      return;
    }
    let currentDate = new Date();
    let currentDateHour: any = currentDate.getHours();
    currentDateHour =
      currentDateHour == 0 ? '00' : currentDateHour < 10 ? `0${currentDateHour}` : currentDateHour;
    let currentDateHourEnd: any = currentDate.getMinutes();
    currentDateHourEnd =
      currentDateHourEnd == 0
        ? '00'
        : currentDateHourEnd < 10
          ? `0${currentDateHourEnd}`
          : currentDateHourEnd;

    // this.startTime = `${currentDateHour}:${currentDate.getMinutes()}`;
    // console.log(this.startTime, 'this.startTime')
    let time = new Date(currentDate.setHours(currentDate.getHours() + value));
    // console.log(time, time.getHours(), time.getMinutes());
    let endHour: any = time.getHours();
    let endHourEnd: any = time.getMinutes();
    endHourEnd = endHourEnd == 0 ? '00' : endHourEnd < 10 ? `0${endHourEnd}` : endHourEnd;
    endHour = endHour == 0 ? '00' : endHour < 10 ? `0${endHour}` : endHour;
    // this.endTime = `${endHour}:${time.getMinutes()}`

    this.form.controls['startTime'].setValue(`${currentDateHour}:${currentDateHourEnd}`);
    this.form.controls['endTime'].setValue(`${endHour}:${endHourEnd}`);

    this.leaveHours = value;
    this.form.controls['leaveDays'].setValue(0);

    this.leaveDays = 0;
  }

  onTabChanged(index: number) {
    this.tabIndex = index;
    if (index == 0) {
      this.submitted = false;
      this.form.reset();
      this.form.patchValue({ startDate: new Date(), endDate: new Date(), leaveDays: 1 })
    } else if (index == 1) {
      this.refresh(this.getDefaultOptions());
      this.paginator?.page.subscribe((page: PageEvent) => {
        this.refresh(this.getDefaultOptions());
      });
      this.dataSource.sort = this.sort;
      this.sort?.sortChange.subscribe((sort) => {
        this.refresh(this.getDefaultOptions());
      });
    }

    // this.displayedColumns = index == 0 ? this.displayedColumnsLeave : this.displayedColumnsHistory;
    // console.log(event, 'event')
  }

  getDate(value: any) {
    let currentDate = new Date(new Date().getTime());

    if (value == 'fri') {
      // console.log(currentDate.getDay());
      let nextFriday = new Date();
      if (currentDate.getDay() == 5) {
        nextFriday = currentDate;
      } else {
        nextFriday = new Date(
          currentDate.setDate(currentDate.getDate() + ((4 - currentDate.getDay() + 1) % 7 || 7)),
        );
      }

    } else if (value == 'mon') {
      const nextMonday = new Date(
        currentDate.setDate(currentDate.getDate() + ((7 - currentDate.getDay() + 1) % 7 || 7)),
      );
    } else if (value == '-1' || value == '1' || value == '0' || value == '2') {
      // console.log(currentDate, parseInt(value), 'parseInt(value)');
      currentDate.setDate(currentDate.getDate() + parseInt(value));
    }
    return currentDate;
  }
  onSubmit() {
    this.submitted = true;
    console.log(this.form.errors)
    if (this.form.invalid) {
      this.alertService.openSnackBar('Form invalid.');
      return;
    }

    // if (data.leaveType) {
    //     data.leaveType = { id: data.leaveType };
    // }

    let formValue = this.form.value;

    let startDate = formValue.startDate;
    let endDate = formValue.endDate;
    if (formValue.startTime) {
      let startTime = formValue.startTime.split(':');
      var dt = new Date(startDate);
      dt.setHours(startTime[0]);
      dt.setMinutes(startTime[1]);
      startDate = new Date(dt).toUTCString();
    }

    if (formValue.endTime) {
      let endTime = formValue.endTime.split(':');
      var dt = new Date(endDate);

      if (parseInt(formValue.endTime) < parseInt(formValue.startTime)) {
        dt = new Date(dt.setDate(dt.getDate() + 1));
      }
      // console.log('out')
      dt.setHours(endTime[0]);
      dt.setMinutes(endTime[1]);
      // console.log(dt)
      endDate = new Date(dt).toUTCString();
      // console.log(endDate)
    }

    // console.log(startDate, endDate)

    let data = {
      strStartDateTime: moment(startDate).utc().format('DD-MM-YYYY HH:mm:ss'),
      strEndDateTime: moment(endDate).utc().format('DD-MM-YYYY HH:mm:ss'),
      totalHour: this.leaveHours,
      leaveReason: formValue.leaveReason,
      leaveType: { id: formValue.leaveType },
      totalDay: formValue.leaveDays,
    };

    // console.log(data, 'data')
    // return;

    // console.log(data, 'dataaa')

    this.leaveService.applyLeave(data).subscribe(
      (res) => {
        console.log(res, 'res')
        if (res.status == 'success') {
          if (this.attachmentFiles && this.attachmentFiles.length > 0) {
            this.uploadPic(res.leaveRequestId)
          } else {
            this.alertService.openSnackBar(CustomMessage.leaveApplySuccess, false);
            this.router.navigate(['/dashboard']);
          }
        } else {
          this.alertService.openSnackBar(CustomMessage.error);
        }
      },
      (error) => {
        this.alertService.openSnackBar(CustomMessage.error);
      },
    );
    // console.log(data, 'data')
  }

  refresh(options: ViewOptions) {
    this.leaveService
      .myLeaveHistory(options)
      .pipe(first())
      .subscribe((result: any) => {
        this.totalRecords = result.totalElement;
        this.dataSource.data = result.data;
        console.log(result, 'result.data');
        let selected = this.dataSource.data.find((elem: any) => {
          return elem.id == this.selectedId
        })
        if (selected) {
          this.expandedElement = selected;
        }
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

  getColor(index: number, id: string) {
    let className: any = 'm-t-5 m-r-5';
    let classArraySize = this.classArray.length;
    if (index < classArraySize) {
      className = `${this.classArray[index]} ${className}`;
    } else if (index >= classArraySize) {
      let i = index % classArraySize;
      i = i > 0 ? i - 1 : 0;
      // console.log(index, classArraySize,this.classArray[i], i, '')
      className = `${this.classArray[i]} ${className}`;
    }

    // console.log(this.selectedLeaveType, 'id', id)
    if (id == this.selectedLeaveType) {
      className = `${className} active`;
    }
    // console.log(className, index)
    return className;
  }


  removeAttachment(index: any) {
    if (this.attachments.length > index) {
      this.attachments.splice(index, 1);
    }

    if (this.attachmentFiles.length > index) {
      this.attachmentFiles.splice(index, 1);
    }

  }

  openFile(url: string) {

    window.open(url, '_blank');
  }
  onFileChange(event: any) {
    if (event !== null && event.target !== null && event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      // console.log(file, 'file')
      let filename = file.type.toLowerCase();
      if (["image/jpeg", "image/png", "image/jpg", "application/pdf"].includes(filename) == true) {
        if (file.size <= 2000000) {
          var reader = new FileReader();
          reader.onload = (e: any) => {
            // console.log('Got here: ', e.target.result);
            let type = ["image/jpeg", "image/png", "image/jpg"].includes(filename) == true ? 'image' : 'pdf';
            this.attachments.push({ url: e.target.result, type: type });
            // this.obj.photoUrl = e.target.result;
          }
          reader.readAsDataURL(file);
          this.attachmentFiles.push(file);

        } else {
          this.alertService.openSnackBar(CustomMessage.invalidLeaveAttachmentSize);
        }
      } else {
        this.alertService.openSnackBar(CustomMessage.invalidLeaveAttachment);
      }
      return;
      // console.log(file, 'sd');
    }


  }


  uploadPic(id: any) {
    let data = new FormData();
    data.append('leaveRequestId', id);
    this.attachmentFiles.map((elem: any) => {
      data.append('files', elem);

    })
    this.leaveService.uploadAttachment(data).subscribe(
      (res) => {
        this.alertService.openSnackBar(CustomMessage.leaveApplySuccess, false);
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        this.alertService.openSnackBar(CustomMessage.leaveApplySuccess, false);
        this.router.navigate(['/dashboard']);

        // this.alertService.openSnackBar(CustomMessage.error);
      },
    );
    // this.
    // console.log(id);
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
      console.log('The dialog was closed');
    });
  }
}
