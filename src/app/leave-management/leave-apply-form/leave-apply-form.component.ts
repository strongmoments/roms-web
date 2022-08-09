import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/core/services';
import { Utils } from 'src/app/core/_helpers/util';
import { Globals } from 'src/app/globals';

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
    constructor(public util: Utils, globals: Globals, private fb: FormBuilder, private alertService: AlertService) {
        this.globals = globals;
        this.form = this.fb.group({
            startDate: new FormControl('', [Validators.required]),
            endDate: new FormControl('', [Validators.required]),
            startTime: new FormControl('', []),
            endTime: new FormControl('', []),
            leaveType: new FormControl('', [Validators.required]),
        });
    }


    get f() { return this.form.controls; }

    public checkError = (controlName: string, errorName: string) => {
        return this.form.controls[controlName].hasError(errorName);
    }


    ngOnInit(): void {
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
