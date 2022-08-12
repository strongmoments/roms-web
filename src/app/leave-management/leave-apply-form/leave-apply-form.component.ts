import { Component, OnInit, ViewChild } from '@angular/core';
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

@Component({
    selector: 'app-leave-apply-form',
    templateUrl: './leave-apply-form.component.html',
    styleUrls: ['./leave-apply-form.component.scss']
})
export class LeaveApplyFormComponent implements OnInit {
    globals: Globals;
    leaveHours: number = 0;
    form: FormGroup;
    submitted: boolean = false;
    displayedColumns: string[] = ['sno', 'dates', 'days', 'time', 'hours', 'manager', 'leave_type', 'status'];
    dataSource = new MatTableDataSource<any>();
    pagesize = 10;
    totalRecords: number = 0;
    @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort!: MatSort;
    historyMonth!: string;
    leaveTypeList: any = [];
    availableLeaveCount: number = 0;
    selectedLeaveType: string = '';
    constructor(public util: Utils, globals: Globals, private fb: FormBuilder, private alertService: AlertService, private leaveService: LeaveService) {
        this.globals = globals;
        this.form = this.fb.group({
            startDate: new FormControl('', [Validators.required]),
            endDate: new FormControl('', [Validators.required]),
            startTime: new FormControl('', []),
            endTime: new FormControl('', []),
            leaveType: new FormControl('', [Validators.required]),
            leaveReason: new FormControl('', [Validators.required]),
        });




        this.leaveService.getLeaveTypes().subscribe((res) => {
            this.leaveTypeList = res && res.data ? res.data : [];
            console.log(res)
        })
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }


    get f() { return this.form.controls; }

    public checkError = (controlName: string, errorName: string) => {
        return this.form.controls[controlName].hasError(errorName);
    }


    ngOnInit(): void {
    }

    setLeaveType(data: any) {
        this.selectedLeaveType = data.id;
        this.availableLeaveCount = data.numberDaysAllowed;
        this.form.controls['leaveType'].setValue(data.id);
    }

    calculateHoursByField() {
        let startTime = parseInt(this.form.controls['startTime'].value);
        let endTime = parseInt(this.form.controls['endTime'].value);

        if (startTime && endTime) {
            console.log(startTime, endTime, endTime < startTime)
            if (endTime < startTime) {
                this.leaveHours = 24 - (startTime - endTime);
            } else {
                this.leaveHours = endTime - startTime;
            }
        } else {
            this.leaveHours = 0;
        }

        return;
    }

    calculateDate(value: string) {
        // console.log((value), 'parseInt(value)');
        let currentDate = new Date(new Date().getTime());
        if (value == 'fri') {
            const nextFriday = new Date(
                currentDate.setDate(
                    currentDate.getDate() + ((4 - currentDate.getDay() + 1) % 7 || 7),
                ),
            );
            this.form.controls['startDate'].setValue(nextFriday);
            this.form.controls['endDate'].setValue(nextFriday);
        } else if (value == 'mon') {
            const nextMonday = new Date(
                currentDate.setDate(
                    currentDate.getDate() + ((7 - currentDate.getDay() + 1) % 7 || 7),
                ),
            );
            console.log(currentDate, 'nextMonday')
            this.form.controls['startDate'].setValue(nextMonday);
            this.form.controls['endDate'].setValue(nextMonday);
        } else if (value == '-1' || value == '1' || value == '0' || value == '2') {
            // console.log(currentDate, parseInt(value), 'parseInt(value)');
            currentDate.setDate(currentDate.getDate() + parseInt(value));
            this.form.controls['startDate'].setValue(currentDate);
            this.form.controls['endDate'].setValue(currentDate);

        }
        // const currentDate = new Date(new Date('2022-08-04').getTime());
        // console.log(currentDate, 'adbace')
        // const nextMonday = new Date(
        //     currentDate.setDate(
        //         currentDate.getDate() + ((4 - currentDate.getDay() + 1) % 7 || 7),
        //     ),
        // );

        // console.log(currentDate, currentDate.getDay());
        // return nextMonday;
        return;

    }

    calculateHours(value: number) {

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
        console.log(this.form, 'data')
        if (this.form.invalid) {
            this.alertService.openSnackBar('Form invalid.');
            return;
        }

        let formValue = this.form.value;
        let data = { strStartDateTime: formValue.startDate, strEndDateTime: formValue.endDate, totalHour: this.leaveHours, leaveReason: formValue.leaveReason, leaveType: { id: formValue.leaveType } };
        // if (data.leaveType) {
        //     data.leaveType = { id: data.leaveType };
        // }

        this.leaveService.applyLeave(data).subscribe((res) => {
            this.alertService.openSnackBar(CustomMessage.leaveApplySuccess, false);
        }, (error) => {
            this.alertService.openSnackBar(CustomMessage.error);
        });
        // console.log(data, 'data')
    }

    refresh(options: ViewOptions) {
        this.leaveService.myLeaveHistory(options).pipe(first()).subscribe((result: any) => {
            this.totalRecords = result.totalCount;
            this.dataSource.data = result.data;
        });

    }

    getDefaultOptions() {
        let obj = this.paginator;
        let sort = this.sort;
        const options: ViewOptions = {
            sortField: (sort !== undefined ? sort.active : 'fullName'),
            sortDirection: (sort !== undefined ? sort.direction : 'asc'),
            // page: (obj != undefined ? (obj.pageIndex == null ? 1 : obj.pageIndex + 1) : 1),
            page: (obj != undefined ? (obj.pageIndex == null ? 0 : obj.pageIndex + 1) : 0),
            search: '',
            query: '',
            pageSize: (obj != undefined ? (obj.pageSize == null ? this.pagesize : obj.pageSize) : this.pagesize)
        };
        return options;
    }

}
