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
    displayedColumnsLeave: string[] = ['staffName', 'dates', 'days', 'time', 'hours', 'manager', 'leave_type', 'comments', 'action'];
    displayedColumnsHistory: string[] = ['sno', 'dates', 'days', 'time', 'hours', 'manager', 'leave_type', 'status', 'comments'];
    displayedColumns: string[] = [];
    dataSource = new MatTableDataSource<any>();
    selectedTabIndex: number = 0;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    pagesize = 10;
    totalRecords: number = 0;
    search: string = '1';//by default 0 for pending list
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
        });

    }

    getDefaultOptions() {
        let obj = this.paginator;
        let sort = this.sort;
        const options: ViewOptions = {
            sortField: (sort !== undefined ? sort.active : 'fullName'),
            sortDirection: (sort !== undefined ? sort.direction : 'asc'),
            page: (obj != undefined ? (obj.pageIndex == null ? 0 : obj.pageIndex + 1) : 0),
            search: this.search,
            query: '',
            pageSize: (obj != undefined ? (obj.pageSize == null ? this.pagesize : obj.pageSize) : this.pagesize)
        };
        return options;
    }


}
