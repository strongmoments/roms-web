import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from 'src/app/core/services';
import { Utils } from 'src/app/core/_helpers/util';
import { Globals } from 'src/app/globals';

export interface UserData {
    id: string;
    name: string;
    progress: string;
    fruit: string;
}

/** Constants used to fill up our data base. */
const FRUITS: string[] = [
    'blueberry',
    'lychee',
    'kiwi',
    'mango',
    'peach',
    'lime',
    'pomegranate',
    'pineapple',
];
const NAMES: string[] = [
    'Maia',
    'Asher',
    'Olivia',
    'Atticus',
    'Amelia',
    'Jack',
    'Charlotte',
    'Theodore',
    'Isla',
    'Oliver',
    'Isabella',
    'Jasper',
    'Cora',
    'Levi',
    'Violet',
    'Arthur',
    'Mia',
    'Thomas',
    'Elizabeth',
];
@Component({
    selector: 'app-leave-request-list',
    templateUrl: './leave-request-list.component.html',
    styleUrls: ['./leave-request-list.component.scss']
})
export class LeaveRequestListComponent implements OnInit {
    globals: Globals;
    leaveHours: number = 0;
    form: FormGroup;
    submitted: boolean = false;
    displayedColumnsLeave: string[] = ['staffName', 'dates', 'days', 'time', 'hours', 'manager', 'leave_type', 'action'];
    displayedColumnsHistory: string[] = ['sno', 'dates', 'days', 'time', 'hours', 'manager', 'leave_type', 'status'];
    displayedColumns: string[] = [];
    dataSource: MatTableDataSource<UserData>;
    selectedTabIndex: number = 0;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(public util: Utils, globals: Globals, private fb: FormBuilder, private alertService: AlertService) {
        this.globals = globals;
        this.form = this.fb.group({
            startDate: new FormControl('', [Validators.required]),
            endDate: new FormControl('', [Validators.required]),
            startTime: new FormControl('', []),
            endTime: new FormControl('', []),
            leaveType: new FormControl('', [Validators.required]),
        });


        // Create 100 users
        const users = Array.from({ length: 100 }, (_, k) => this.createNewUser(k + 1));

        // Assign the data to the data source for the table to render
        this.dataSource = new MatTableDataSource(users);
    }

    createNewUser(id: number): UserData {
        const name =
            NAMES[Math.round(Math.random() * (NAMES.length - 1))] +
            ' ' +
            NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) +
            '.';

        return {
            id: id.toString(),
            name: name,
            progress: Math.round(Math.random() * 100).toString(),
            fruit: FRUITS[Math.round(Math.random() * (FRUITS.length - 1))],
        };
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
        this.displayedColumns = this.displayedColumnsLeave;
    }

    onTabChanged(index: number) {
        this.selectedTabIndex = index;
        this.displayedColumns=index==0?this.displayedColumnsLeave:this.displayedColumnsHistory;
        console.log(event, 'event')
    }
    calculateDate(value: string) {
        console.log((value), 'parseInt(value)');
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

        // this.startTime = `${currentDateHour}:${currentDate.getMinutes()}`;
        // console.log(this.startTime, 'this.startTime')
        let time = new Date(currentDate.setHours(currentDate.getHours() + value));
        console.log(time, time.getHours(), time.getMinutes());
        let endHour: any = time.getHours();
        endHour = endHour == 0 ? '00' : endHour < 10 ? `0${endHour}` : endHour;
        // this.endTime = `${endHour}:${time.getMinutes()}`

        this.form.controls['startTime'].setValue(`${currentDateHour}:${currentDate.getMinutes()}`);
        this.form.controls['endTime'].setValue(`${endHour}:${time.getMinutes()}`);

        this.leaveHours = value;
    }


    onSubmit() {
        this.submitted = true;
        console.log(this.form, 'data')
        if (this.form.invalid) {
            this.alertService.openSnackBar('Form invalid.');
            return;
        }

        let data = this.form.value;
        console.log(data, 'data')
        this.alertService.openSnackBar('Leave request is successfully sent to your manager.', false);
    }
}
