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
    selector: 'app-leave-request-list',
    templateUrl: './leave-request-list.component.html',
    styleUrls: ['./leave-request-list.component.scss']
})
export class LeaveRequestListComponent implements OnInit {
    globals: Globals;
    // leaveHours: number = 0;
    // form: FormGroup;
    submitted: boolean = false;
    displayedColumnsLeave: string[] = ['staffName','applyDate', 'dates', 'days', 'time', 'hours', 'leave_type', 'leaveReason', 'action'];
    displayedColumnsHistory: string[] = ['staffName','applyDate', 'dates', 'days', 'time', 'hours', 'leave_type', 'status', 'leaveReason','reviewerRemark'];
    displayedColumns: string[] = [];
    dataSource = new MatTableDataSource<any>();
    selectedTabIndex: number = 0;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    pagesize = 10;
    totalRecords: number = 0;
    search: string = '1';//by default 0 for pending list
    comments: any = [];
    constructor(public util: Utils, globals: Globals, private fb: FormBuilder, private alertService: AlertService, private leaveService: LeaveService) {
        this.globals = globals;
    }



    ngAfterViewInit() {
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
        this.paginator.page.subscribe((page: PageEvent) => {
            this.refresh(this.getDefaultOptions());
        });
        this.dataSource.sort = this.sort;
        this.sort.sortChange.subscribe((sort) => {
            this.refresh(this.getDefaultOptions());
        });
    }


    // F


    ngOnInit(): void {
        this.displayedColumns = this.displayedColumnsLeave;
        this.refresh(this.getDefaultOptions());
    }

    onTabChanged(index: number) {
        this.dataSource.data = [];
        this.totalRecords = 0;
        this.search = index == 0 ? '1' : '0';
        this.selectedTabIndex = index;
        this.displayedColumns = index == 0 ? this.displayedColumnsLeave : this.displayedColumnsHistory;
        // console.log(event, 'event')
        this.refresh(this.getDefaultOptions());
    }


    refresh(options: ViewOptions) {
        this.leaveService.staffLeaveHistory(options).pipe(first()).subscribe((result: any) => {
            this.totalRecords = result.totalCount;
            this.dataSource.data = result.data;
            console.log(result.data, 'result.data')
            this.comments = [];
            result.data.map(() => {
                this.comments.push('');
            });

        });

    }

    getDefaultOptions() {
        let obj = this.paginator;
        let sort = this.sort;
        // console.warn(obj.pageIndex)
        const options: ViewOptions = {
            sortField: (sort !== undefined ? sort.active : 'fullName'),
            sortDirection: (sort !== undefined ? sort.direction : 'asc'),
            page: (obj != undefined ? (obj.pageIndex == null || obj.pageIndex == 0 ? 0 : obj.pageIndex + 1) : 0),
            search: this.search,
            query: '',
            pageSize: (obj != undefined ? (obj.pageSize == null ? this.pagesize : obj.pageSize) : this.pagesize)
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
            return elem.value == status
        })?.name;
    }

    addComment(index: number,event: any) {
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
            this.leaveService.approveLeave({ id: id, reviewerRemark: (this.comments[index] ? this.comments[index] : '') }).subscribe((res) => {
                this.alertService.openSnackBar(CustomMessage.leaveAccepted, false);
                this.refresh(this.getDefaultOptions());
                // this.router.navigate(['/dashboard']);
            }, (error) => {
                this.alertService.openSnackBar(CustomMessage.error);
            });
        } else if (type == 1) {

            this.leaveService.rejectLeave({ id: id, reviewerRemark: (this.comments[index] ? this.comments[index] : '') }).subscribe((res) => {
                this.alertService.openSnackBar(CustomMessage.leaveAccepted, false);
                this.refresh(this.getDefaultOptions());
                // this.router.navigate(['/dashboard']);
            }, (error) => {
                this.alertService.openSnackBar(CustomMessage.error);
            });
        }
    }

}
