import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { AlertService, EmployeeService } from 'src/app/core/services';
import { Utils } from 'src/app/core/_helpers/util';
import { Globals } from 'src/app/globals';

@Component({
  selector: 'app-employee-transfer-form',
  templateUrl: './employee-transfer-form.component.html',
  styleUrls: ['./employee-transfer-form.component.css']
})
export class EmployeeTransferFormComponent implements OnInit {
  globals: Globals;
  form: FormGroup;
  submitted: boolean = false;
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions!: Observable<string[]>;
  todayDate: Date = new Date();
  employeeList: any;
  selectedEmployee: any;
  gangList: any;
  selectedGang: any;
  constructor(public util: Utils, globals: Globals, private fb: FormBuilder, private alertService: AlertService, private router: Router, private employeeService: EmployeeService) {

    this.globals = globals;
    this.form = this.fb.group({
      type: new FormControl('', [Validators.required]),
      employee: new FormControl('', [Validators.required]),
      transferTo: new FormControl('', [Validators.required]),
      transferLocation: new FormControl('', [Validators.required]),
      rate: new FormControl('', [Validators.required, Validators.pattern(this.util.numericRegex)]),
      transferDate: new FormControl('', [Validators.required]),
    });

  }


  get f() { return this.form.controls; }

  public checkError = (controlName: string, errorName: string) => {
    return this.form.controls[controlName].hasError(errorName);
  }

  ngOnInit(): void {
    this.searchEmployee({ target: { value: '' } });
    this.searchGang({ target: { value: '' } });
    // this.employeeService.getAll().subscribe((result: any) => {
    //   console.log(result)
    // });

    this.filteredOptions = this.form.controls['employee'].valueChanges.pipe(
      startWith(''),
      map((value: any) => this._filter(value || '')),
    );
  }

  searchEmployee(event: any) {
    console.log(event, 'test')
    this.employeeService.searchEmployee(event.target.value).subscribe((result: any) => {
      console.log(result, 'resukt employee')
      this.employeeList = result;
    });
  }

  searchGang(event: any) {
    console.log(event, 'test')
    this.employeeService.searchGang(event.target.value).subscribe((result: any) => {
      console.log(result, 'resukt gangList')
      this.gangList = result;
    });
  }

  selectGang(event: any) {
    if (event.value) {
      let selected = this.gangList.find((elem: any) => elem.id.toString() == event.value.toString());
      console.log(event, selected, 'selectedGang   ');
      this.selectedGang = selected ? selected : null;
    }
  }

  selectEmployee(event: any) {
    if (event.value) {
      let selected = this.employeeList.find((elem: any) => elem.id.toString() == event.value.toString());
      console.log(event, selected, 'selectedEmployeeselectedEmployee   ');
      this.selectedEmployee = selected ? selected : null;
    }
  }

  calculateDate(value: string) {
    let currentDate = new Date(new Date().getTime());
    if (value == 'fri') {
      // const nextFriday = new Date(
      //   currentDate.setDate(
      //     currentDate.getDate() + ((4 - currentDate.getDay() + 1) % 7 || 7),
      //   ),
      // );
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
      this.form.controls['transferDate'].setValue(nextFriday);
      // this.form.controls['endDate'].setValue(nextFriday);
    } else if (value == 'mon') {
      const nextMonday = new Date(
        currentDate.setDate(
          currentDate.getDate() + ((7 - currentDate.getDay() + 1) % 7 || 7),
        ),
      );
      console.log(currentDate, 'nextMonday')
      this.form.controls['transferDate'].setValue(nextMonday);
      // this.form.controls['endDate'].setValue(nextMonday);
    } else if (value == '-1' || value == '1' || value == '0' || value == '2') {
      // console.log(currentDate, parseInt(value), 'parseInt(value)');
      currentDate.setDate(currentDate.getDate() + parseInt(value));
      this.form.controls['transferDate'].setValue(currentDate);
      // this.form.controls['endDate'].setValue(currentDate);
    }
    return;
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.form.value)
    if (this.form.invalid) {
      this.alertService.openSnackBar('Form invalid.');
      return;
    }

    // if (data.leaveType) {
    //     data.leaveType = { id: data.leaveType };
    // }

    // let formValue = this.form.value;



    // let startDate = formValue.startDate;
    // let endDate = formValue.endDate;
    // if (formValue.startTime) {
    //     let startTime = formValue.startTime.split(":");
    //     var dt = new Date(startDate);
    //     dt.setHours(startTime[0]);
    //     dt.setMinutes(startTime[1]);
    //     startDate = new Date(dt);
    // }

    // if (formValue.endTime) {
    //     let endTime = formValue.endTime.split(":");
    //     var dt = new Date(endDate);
    //     dt.setHours(endTime[0]);
    //     dt.setMinutes(endTime[1]);
    //     endDate = new Date(dt);
    // }

    // console.warn(startDate, endDate);
    // let data = {
    //     strStartDateTime:moment(startDate).format('DD-MM-YYYY HH:mm:ss'),
    //     strEndDateTime:moment(endDate).format('DD-MM-YYYY HH:mm:ss'), totalHour: this.leaveHours, leaveReason: formValue.leaveReason, leaveType: { id: formValue.leaveType },
    //     totalDay: this.leaveDays
    // };

    // console.log(data, 'data')


    // console.log(data, 'dataaa')

    // this.leaveService.applyLeave(data).subscribe((res) => {
    //     this.alertService.openSnackBar(CustomMessage.leaveApplySuccess, false);
    //     this.router.navigate(['/dashboard']);
    // }, (error) => {
    //     this.alertService.openSnackBar(CustomMessage.error);
    // });
    // console.log(data, 'data')
  }


}
