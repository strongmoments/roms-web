import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER, COMMA, F, E } from '@angular/cdk/keycodes';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Utils } from 'src/app/core/_helpers/util';
import { CustomMessage } from 'src/app/custom-message';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/core/services';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { Globals } from 'src/app/globals';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
export interface DemoColor {
  name: string;
  color: string;
}
@Component({
  selector: 'app-recruitment',
  templateUrl: './recruitment.component.html',
  styleUrls: ['./recruitment.component.scss'],
})
export class RecruitmentComponent implements OnInit {
  @ViewChild('resourceDemandDialog') resourceDemandDialog!: TemplateRef<any>;
  globals: Globals;
  form: FormGroup;
  submitted: boolean = false;
  departments: any = [];
  roles: any = [];
  managers: any = [];
  employeeType: any = [];
  selectedCertifications: any = [];
  selectedTickets: any = [];
  selectedLicenses: any = [];
  certificateList: any = [];


  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];
  fruits = [{ name: 'Lemon' }, { name: 'Lime' }, { name: 'Apple' }];
  fruits2 = [{ name: 'Lemon2' }, { name: 'Lime2' }, { name: 'Apple2' }];

  availableColors: DemoColor[] = [
    { name: 'none', color: '' },
    { name: 'Primary', color: 'primary' },
    { name: 'Accent', color: 'accent' },
    { name: 'Warn', color: 'warn' },
  ];

  constructor(private dialog: MatDialog, private fb: FormBuilder, private utils: Utils, private alertService: AlertService, private router: Router, private authService: AuthenticationService, private global: Globals) {
    this.globals = global;

    this.authService.getAllEmployeeType().subscribe((result: any) => {
      this.employeeType = result && result.data && result.data.length > 0 ? result.data : [];
    });

    this.authService.getAllDepartmentType().subscribe((result: any) => {
      this.departments = result && result.data && result.data.length > 0 ? result.data : [];
    });

    this.authService.getAllManagers().subscribe((result: any) => {
      this.managers = result && result.data && result.data.length > 0 ? result.data : [];
    });

    this.authService.getAllRoles().subscribe((result: any) => {
      this.roles = result && result.data && result.data.length > 0 ? result.data : [];
    });

    this.authService.getCertificationsList('').subscribe((result) => {
      // console.log(result, 'sdsselectedCertifications')
      this.certificateList = result;
    });


    this.form = this.fb.group({
      managerId: new FormControl('', [Validators.required]),
      roleId: new FormControl('', [Validators.required]),
      demandType: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.pattern(this.utils.emailRegex), Validators.maxLength(30)]),
      propsedStartDate: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      minExperience: new FormControl('0', [Validators.required]),
      certifications: new FormControl('', [Validators.required]),
      licenses: new FormControl('', [Validators.required]),
      tickets: new FormControl('', [Validators.required]),
      project: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required]),
      contractType: new FormControl('', [Validators.required]),
      classification: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
      rate: new FormControl('', [Validators.required]),
      gang: new FormControl('', []),
      commitment: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {

  }

  selected(event: MatAutocompleteSelectedEvent, type: string) {

    console.log(event.option.value, 'qqqqqqqqqqqqq')
    const value = event.option.viewValue;
    if (type == 'certification' && (value || '').trim()) {
      this.selectedCertifications.push((value).trim())
    } else if (type == 'licence' && (value || '').trim()) {
      this.selectedLicenses.push((value).trim())

    } else if (type == 'ticket' && (value || '').trim()) {
      this.selectedTickets.push((value).trim())

    }

  }
  add(event: MatChipInputEvent, type: string): void {
    console.log('asdsad')
    // const input = event.input;
    const value = event.value.trim();

    if (type == 'certification' && value) {
      if (!this.certificateList.some((elem: any) => value == elem.code)) {
        this.authService.createCertification({ code: value, name: value }).subscribe((result) => {
          if (result && result.status == 'success') {
            this.selectedCertifications.push(value);
            this.certificateList.push({ code: value, name: value });
          }
          console.log(result, 'asdcreateate');
        });
      } else {
        if (!this.selectedCertifications.includes(value)) {
          this.selectedCertifications.push(value);
        }
      }
    } else if (type == 'licence' && value) {
      this.selectedLicenses.push(value);

    } else if (type == 'ticket' && value) {
      this.selectedTickets.push(value);

    }

    // // Add our fruit
    // if ((value || '').trim()) {
    //   this.fruits.push({ name: value.trim() });
    //   this.fruits2.push({ name: value.trim() });
    // }

    // Reset the input value
    // if (input) {
    //   input.value = '';
    // }
    event.chipInput!.clear();

  }

  remove(value: any, type: string): void {
    console.log('sd', value, type);

    if (type == 'certification' && value) {

      const index = this.selectedCertifications.indexOf(value);
      if (index >= 0) {
        // console.log(index, 'sd', value, type, this.selectedCertifications);

        this.selectedCertifications = this.selectedCertifications.length > 1 ? this.selectedCertifications.splice(index, 1) : [];
      }
    } else if (type == 'licence' && value) {

      const index = this.selectedLicenses.indexOf(value);
      // console.log(index, 'sd', value, type);
      if (index >= 0) {
        this.selectedLicenses = this.selectedLicenses.length > 1 ? this.selectedLicenses.splice(index, 1) : [];
      }
    } else if (type == 'ticket' && value) {

      const index = this.selectedTickets.indexOf(value);
      // console.log(index, 'sd', value, type);
      if (index >= 0) {
        this.selectedTickets = this.selectedTickets.length > 1 ? this.selectedTickets.splice(index, 1) : [];
      }
    }
    // const index = this.fruits.indexOf(item);
    // const index2 = this.items2.indexOf(item);

    // if (index >= 0) {
    //   this.items.splice(index, 1);
    // }
    // if (index2 >= 0) {
    //   this.items2.splice(index2, 1);
    // }
  }




  get f() {
    return this.form.controls;
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.form.controls[controlName].hasError(errorName);
  };


  onSubmit() {
    this.submitted = true;
    this.openDialog({});
    if (this.form.invalid) {
      this.alertService.openSnackBar(CustomMessage.invalidForm);
      return;
    }
  }

  openDialog(data: any) {
    const dialogRef = this.dialog.open(this.resourceDemandDialog, {
      width: '30em',
      height: '20em',
      data: { data: data },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // this.router.navigate(['/registration/list']);
      console.log('The dialog was closed');
    });
  }
}
