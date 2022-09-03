import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { AlertService } from 'src/app/core/services';
import { LeaveService } from 'src/app/core/services/leave.service';
import { Utils } from 'src/app/core/_helpers/util';
import { CustomMessage } from 'src/app/custom-message';
import { Globals } from 'src/app/globals';
import { ViewOptions } from 'src/app/_models';
import * as moment from 'moment';
import { animate, state, style, transition, trigger } from '@angular/animations';

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
    displayedColumns: string[] = ['applyDate', 'leave_type', 'dates', 'days', 'time', 'hours', 'manager', 'leaveReason'];
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
    classArray = ['custom-button-grey', 'custom-button-light-grey', 'custom-button-purple', 'custom-button-light-pink', 'custom-button-light-green', 'custom-button-ligh-orange', 'custom-button-light-blue', 'custom-button-light-blue-1', 'custom-button-brown'];
    currentDate: any = new Date();
    // columnsToDisplay: string[] = ['leaveReason', 'reviewerRemark'];
    expandedElement: any = null;
    constructor(public util: Utils, globals: Globals, private fb: FormBuilder, private alertService: AlertService, private leaveService: LeaveService, private router: Router) {
        console.log(this.minDate, this.maxDate)
        this.globals = globals;
        this.form = this.fb.group({
            startDate: new FormControl('', [Validators.required]),
            endDate: new FormControl('', [Validators.required]),
            startTime: new FormControl('', []),
            endTime: new FormControl('', []),
            leaveDays: new FormControl('', [Validators.required, Validators.pattern(this.util.intRegex)]),
            leaveType: new FormControl('', [Validators.required]),
            leaveReason: new FormControl('', [Validators.required]),
        });


        this.leaveService.getLeaveTypes().subscribe((res) => {
            this.leaveTypeList = res && res.data ? res.data : [];
            this.selectedLeaveType = this.leaveTypeList && this.leaveTypeList.length > 0 ? this.leaveTypeList[0].id : '';
            console.log(res)
        });
        this.leaveService.getManager().subscribe((res) => {
            this.managerData = res;
            console.log(res, 's');
        })
    }

    ngAfterViewInit() {
        // this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.paginator.page.subscribe((page: PageEvent) => {
            this.refresh(this.getDefaultOptions());
        });
    }


    get f() { return this.form.controls; }

    public checkError = (controlName: string, errorName: string) => {
        return this.form.controls[controlName].hasError(errorName);
    }


    convertTimeMoment(value: any, format: string) {
        try {
            return moment(value).utc().format(format);
        } catch (e) {
            return;
        }
    }
    ngOnInit(): void {
    }

    checkLeaveDays(event: any) {
        let startDay = (this.form.controls['startDate'].value);
        let endDay = (this.form.controls['endDate'].value);
        // this.isTimeInputDisabled = false;

        // this.form.controls['leaveDays'].setValue(0);
        // this.leaveDays = 0;
        console.log('sads', startDay, endDay)
        if (startDay && endDay) {

            var date1 = new Date(startDay);
            var date2 = new Date(endDay);

            // To calculate the time difference of two dates
            var Difference_In_Time = date2.getTime() - date1.getTime();

            // To calculate the no. of days between two dates
            var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
            console.log(Difference_In_Days, 'Difference_In_Days')
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
        console.log(event)
    }

    setLeaveType(data: any) {
        this.selectedLeaveType = data.id;
        this.availableLeaveCount = data.numberDaysAllowed;
        this.form.controls['leaveType'].setValue(data.id);
    }

    calculateHoursByField() {
        let startTime = (this.form.controls['startTime'].value);
        let endTime = (this.form.controls['endTime'].value);
        console.log(startTime, endTime, endTime < startTime)

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
            console.log(startTime, endTime, endTime < startTime)
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
        let startDay = (this.form.controls['startDate'].value);
        let endDay = (this.form.controls['endDate'].value);
        this.isTimeInputDisabled = false;
        let currentDate = new Date(new Date().getTime());
        let leaveDays = 1;
        if (this.form.controls['startTime'].value != '' || this.form.controls['endTime'].value != '') {
            leaveDays = 0;
        }
        if (value == 'fri') {
            console.log(currentDate.getDay())
            let nextFriday = new Date();
            if (currentDate.getDay() == 5) {
                nextFriday = currentDate;
            } else {
                nextFriday = new Date(
                    currentDate.setDate(
                        currentDate.getDate() + ((4 - currentDate.getDay() + 1) % 7 || 7),
                    ),
                );
            }
            this.form.controls['startDate'].setValue(nextFriday);
            this.form.controls['endDate'].setValue(nextFriday);

            this.form.controls['leaveDays'].setValue(leaveDays);
            this.leaveDays = leaveDays;
        } else if (value == 'mon') {
            const nextMonday = new Date(
                currentDate.setDate(
                    currentDate.getDate() + ((7 - currentDate.getDay() + 1) % 7 || 7),
                ),
            );
            console.log(currentDate, 'nextMonday')
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
        let startDay = (this.form.controls['startDate'].value);
        let endDay = (this.form.controls['endDate'].value);
        this.isTimeInputDisabled = false;

        this.form.controls['leaveDays'].setValue(0);
        this.leaveDays = 0;
        console.log('sads', startDay, endDay)
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

                if (this.form.controls['startTime'].value != '' || this.form.controls['endTime'].value != '') {
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
        currentDateHour = currentDateHour == 0 ? '00' : currentDateHour < 10 ? `0${currentDateHour}` : currentDateHour;
        let currentDateHourEnd: any = currentDate.getMinutes();
        currentDateHourEnd = currentDateHourEnd == 0 ? '00' : currentDateHourEnd < 10 ? `0${currentDateHourEnd}` : currentDateHourEnd;

        // this.startTime = `${currentDateHour}:${currentDate.getMinutes()}`;
        // console.log(this.startTime, 'this.startTime')
        let time = new Date(currentDate.setHours(currentDate.getHours() + value));
        console.log(time, time.getHours(), time.getMinutes());
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
        if (index == 0) {
            this.submitted = false;
            this.form.reset();
        } else if (index == 1) {
            this.refresh(this.getDefaultOptions());
            this.paginator.page.subscribe((page: PageEvent) => {
                this.refresh(this.getDefaultOptions());
            });
            this.dataSource.sort = this.sort;
            this.sort.sortChange.subscribe((sort) => {
                this.refresh(this.getDefaultOptions());
            });
        }
        // this.selectedTabIndex = index;
        // this.displayedColumns = index == 0 ? this.displayedColumnsLeave : this.displayedColumnsHistory;
        // console.log(event, 'event')
    }

    onSubmit() {
        this.submitted = true;
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
            let startTime = formValue.startTime.split(":");
            var dt = new Date(startDate);
            dt.setHours(startTime[0]);
            dt.setMinutes(startTime[1]);
            startDate = new Date(dt).toUTCString();
        }

        if (formValue.endTime) {
            let endTime = formValue.endTime.split(":");
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
            strEndDateTime: moment(endDate).utc().format('DD-MM-YYYY HH:mm:ss'), totalHour: this.leaveHours, leaveReason: formValue.leaveReason, leaveType: { id: formValue.leaveType },
            totalDay: formValue.leaveDays
        };

        // console.log(data, 'data')
        // return;

        // console.log(data, 'dataaa')

        this.leaveService.applyLeave(data).subscribe((res) => {
            this.alertService.openSnackBar(CustomMessage.leaveApplySuccess, false);
            this.router.navigate(['/dashboard']);
        }, (error) => {
            this.alertService.openSnackBar(CustomMessage.error);
        });
        // console.log(data, 'data')
    }

    refresh(options: ViewOptions) {
        this.leaveService.myLeaveHistory(options).pipe(first()).subscribe((result: any) => {
            this.totalRecords = result.totalElement;
            this.dataSource.data = result.data;
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



    getColor(index: number, id: string) {
        let className: any = 'm-t-5 m-r-5';
        let classArraySize = this.classArray.length;
        if (index < classArraySize) {
            className = `${this.classArray[index]} ${className}`;
        } else if (index >= classArraySize) {
            let i = (index % classArraySize);
            i = i > 0 ? i - 1 : 0;
            // console.log(index, classArraySize,this.classArray[i], i, '')
            className = `${this.classArray[i]} ${className}`;
        }

        // console.log(this.selectedLeaveType, 'id', id)
        if (id == this.selectedLeaveType) {
            className = `${className} active`;
        }
        console.log(className, index)
        return className;
    }

}
