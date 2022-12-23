import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatChipInputEvent, MatChipList } from '@angular/material/chips';
import { ENTER, COMMA, F, E } from '@angular/cdk/keycodes';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Utils } from 'src/app/core/_helpers/util';
import { CustomMessage } from 'src/app/custom-message';
import { Router } from '@angular/router';
import { AlertService, EmployeeService, JobService } from 'src/app/core/services';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { Globals } from 'src/app/globals';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import * as moment from 'moment';
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
  certificateList: any = [];
  filteredCertificate?: Observable<string[]>;
  certificationCtrl = new FormControl(null, [Validators.required]);

  selectedLicenses: any = [];
  licenseList: any = [];
  filteredLicense?: Observable<string[]>;
  licenseCtrl = new FormControl(null, [Validators.required]);

  selectedTickets: any = [];
  ticketList: any = [];
  filteredTicket?: Observable<string[]>;
  ticketCtrl = new FormControl(null, [Validators.required]);

  clients: any = [];

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;

  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];

  @ViewChild('certificateInput', {static: false}) certificateInput?: ElementRef ;
  @ViewChild('autoCertificate', {static: false}) autoCertificate?: MatAutocomplete;
  @ViewChild("chipListCertificate") chipListCertificate ?: MatChipList;

  @ViewChild('licenseInput', {static: false}) licenseInput?: ElementRef ;
  @ViewChild('autoLicense', {static: false}) autoLicense?: MatAutocomplete;
  @ViewChild("chipListLicense") chipListLicense : any;

  @ViewChild('ticketInput', {static: false}) ticketInput?: ElementRef ;
  @ViewChild('autoTicket', {static: false}) autoTicket?: MatAutocomplete;
  @ViewChild("chipListTicket") chipListTicket : any;

  constructor(private dialog: MatDialog, 
    private fb: FormBuilder, private utils: Utils, 
    private alertService: AlertService, private router: Router, private authService: AuthenticationService, 
    private global: Globals, private employeeService: EmployeeService, private jobService: JobService) 
  {
    this.globals = global;

    this.authService.getAllEmployeeType().subscribe((result: any) => {
      this.employeeType = result && result.data && result.data.length > 0 ? result.data : [];
    });

    this.authService.getAllDepartmentType().subscribe((result: any) => {
      this.departments = result && result.data && result.data.length > 0 ? result.data : [];
    });

    this.searchEmployee({ target: { value: '' } });
    this.searchClient({ target: { value: '' } });

    // this.authService.getAllManagers().subscribe((result: any) => {
    //   this.managers = result && result.data && result.data.length > 0 ? result.data : [];
    // });

    this.authService.getAllRoles().subscribe((result: any) => {
      this.roles = result && result.data && result.data.length > 0 ? result.data : [];
    });

    this.getCertificationList();
    this.getLicenseList();
    this.getTicketList();

    this.form = this.fb.group({
      managerId: new FormControl('', [Validators.required]),
      roleId: new FormControl('', [Validators.required]),
      demandType: new FormControl('1', [Validators.required]),
      demandTitle: new FormControl('', [Validators.required]),
      //email: new FormControl('', [Validators.required, Validators.pattern(this.utils.emailRegex), Validators.maxLength(30)]),
      propsedStartDate: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      minExperience: new FormControl('', [Validators.required]),
      certifications: new FormControl('', [Validators.required]),
      licenses: new FormControl('', [Validators.required]),
      tickets: new FormControl('', [Validators.required]),
      project: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required]),
      contractType: new FormControl('', [Validators.required]),
      classification: new FormControl('', [Validators.required]),
      //role: new FormControl('', [Validators.required]),
      rate: new FormControl('', []),
      gang: new FormControl('', [Validators.required]),
      commitment: new FormControl('', [Validators.required]),
      client: new FormControl('', [Validators.required]),
      awardType: new FormControl('', [Validators.required]),
    });

    this.filteredCertificate = this.certificationCtrl.valueChanges.pipe(
      startWith(null),
      map((certificate: string | null) => certificate ? this._filterCertificate(certificate) : this.certificateList.slice()));
      //this.setCertificateErrorState();

    this.filteredLicense = this.licenseCtrl.valueChanges.pipe(
      startWith(null),
      map((license: string | null) => license ? this._filterLicense(license) : this.licenseList.slice()));
      //this.setLicenseErrorState();

    this.filteredTicket = this.ticketCtrl.valueChanges.pipe(
      startWith(null),
      map((ticket: string | null) => ticket ? this._filterTicket(ticket) : this.ticketList.slice()));
      //this.setTicketErrorState();
  }

  ngOnInit(): void {

  }

  getCertificationList(){
    this.authService.getCertificationsList('').subscribe((result) => {
      this.certificateList = result;
    });
  }

  getLicenseList(){
    this.authService.getLicenseList('').subscribe((result) => {
      this.licenseList = result;
    });
  }

  getTicketList(){
    this.authService.getTicketsList('').subscribe((result) => {
      this.ticketList = result;
    });
  }

  selected(event: MatAutocompleteSelectedEvent, type: string) {
    const value = event.option.value;
    const code = value.code;
    if (type == 'certification' ) {
      this.selectedCertifications.push(value);
      this.certificateInput!.nativeElement.value = '';
      this.certificationCtrl.setValue(null);
      this.setCerticateFormControl();
    } else if (type == 'license') {
      this.selectedLicenses.push(value);
      this.licenseInput!.nativeElement.value = '';
      this.licenseCtrl.setValue(null);
      this.setLicenseFormControl();
    } else if (type == 'ticket') {
      this.selectedTickets.push(value);
      this.ticketInput!.nativeElement.value = '';
      this.ticketCtrl.setValue(null);
      this.setTicketFormControl();
    }

  }

  setCerticateFormControl(){
    this.form.controls.certifications.setValue(this.selectedCertifications);
  }

  setLicenseFormControl(){
    this.form.controls.licenses.setValue(this.selectedLicenses);
  }

  setTicketFormControl(){
    this.form.controls.tickets.setValue(this.selectedTickets);
  }

  private _filterCertificate(value: any): any[] {
    const filterValue = value.name ? value.name.toLowerCase() : value.toLowerCase();
    return this.certificateList.filter((certificate : any) => certificate.name.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterLicense(value: any): any[] {
    const filterValue = value.name ? value.name.toLowerCase() : value.toLowerCase();
    return this.licenseList.filter((license : any) => license.name.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterTicket(value: any): any[] {
    const filterValue = value.name ? value.name.toLowerCase() : value.toLowerCase();
    return this.ticketList.filter((ticket : any) => ticket.name.toLowerCase().indexOf(filterValue) === 0);
  }

  add(event: MatChipInputEvent, type: string): void {
    const value = event.value.trim();

    if (type == 'certification' && value) {
      if ((event.value || '').trim() && !this.autoCertificate!.isOpen) {
        this.selectedCertifications.push({
          code: value,
          name: value
        });
        this.certificateInput!.nativeElement.value = '';
        this.certificationCtrl.setValue(null);
      }
      this.setCerticateFormControl();

    } else if (type == 'license' && value) {
      if ((event.value || '').trim() && !this.autoLicense!.isOpen) {
        this.selectedLicenses.push({
          code: value,
          name: value
        });
        this.licenseInput!.nativeElement.value = '';
        this.licenseCtrl.setValue(null);
      }
      this.setLicenseFormControl();

    } else if (type == 'ticket' && value) {
      if ((event.value || '').trim() && !this.autoTicket!.isOpen) {
        this.selectedTickets.push({
          code: value,
          name: value
        });
        this.ticketInput!.nativeElement.value = '';
        this.ticketCtrl.setValue(null);
      }
      this.setTicketFormControl();

    }


  }

  remove(value: any, type: string): void {
    if (type == 'certification' && value) {
      const index = this.selectedCertifications.indexOf(value);
      if (index >= 0) {
        this.selectedCertifications.splice(index, 1);
      }
      this.setCerticateFormControl();
    } else if (type == 'license' && value) {
      const index = this.selectedLicenses.indexOf(value);
      if (index >= 0) {
        //this.selectedLicenses = this.selectedLicenses.length > 1 ? this.selectedLicenses.splice(index, 1) : [];
        this.selectedLicenses.splice(index, 1);
      }
      this.setLicenseFormControl();
    } else if (type == 'ticket' && value) {
      const index = this.selectedTickets.indexOf(value);
      if (index >= 0) {
        this.selectedTickets.splice(index, 1);
      }
      this.setTicketFormControl();
    }
  }




  get f() {
    return this.form.controls;
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.form.controls[controlName].hasError(errorName);
  };


  onSubmit() {
    this.submitted = true;
    // this.openDialog({});

    if (this.form.invalid) {
      this.alertService.openSnackBar(CustomMessage.invalidForm);
      return;
    }
    else{

      let certString = ''
      let certLength = this.selectedCertifications.length;
      this.selectedCertifications.forEach((ele:any, i: number) => {
        if(i == 0){
          certString =  '{"' + ele.code + '":"' + ele.name + '"';
        }
        else if(certLength - 1 == i){
          certString = certString + ',"' + ele.code + '":"' + ele.name + '"}';
        }
        else{
          certString = certString + ',"' + ele.code + '":"' + ele.name + '"';
        }
      });

      let licenseString = ''
      let licenseLength = this.selectedCertifications.length;
      this.selectedLicenses.forEach((ele:any, i: number) => {
        if(i == 0){
          licenseString =  '{"' + ele.code + '":"' + ele.name + '"';
        }
        else if(licenseLength - 1 == i){
          licenseString = licenseString + ',"' + ele.code + '":"' + ele.name + '"}';
        }
        else{
          licenseString = licenseString + ',"' + ele.code + '":"' + ele.name + '"';
        }
      });

      let ticketString = ''
      let ticketLength = this.selectedCertifications.length;
      this.selectedTickets.forEach((ele:any, i: number) => {
        if(i == 0){
          ticketString =  '{"' + ele.code + '":"' + ele.name + '"';
        }
        else if(ticketLength - 1 == i){
          ticketString = ticketString + ',"' + ele.code + '":"' + ele.name + '"}';
        }
        else{
          ticketString = ticketString + ',"' + ele.code + '":"' + ele.name + '"';
        }
      });

      let skills = {
        "certification": JSON.parse(certString),
        "licenses": JSON.parse(licenseString),
        "plantTicket": JSON.parse(ticketString)
      }
      console.log('Skills:',JSON.stringify(skills));

      let payload = {
        "hiringManagerId" : this.form.controls.managerId.value,
        "demandType" : this.form.controls.demandType.value,
        "profileRole" : this.form.controls.demandTitle.value,
        "perposedDate" : moment(this.form.controls.propsedStartDate.value).format('DD/MM/YYYY'),
        "description" : this.form.controls.description.value,
        "type" : '',

        "classification" :'',
        "minimumExperiecne" : this.form.controls.minExperience.value,
        "clientProjectName" : this.form.controls.project.value,
        "clientProjectNameId" : null,
        "locationName" : this.form.controls.location.value,
        "contractName" : this.form.controls.contractType.value,

        "contractId" : null,
        "clientProjectRoleId" : '',
        "clientProjectRoleName" : '',
        "rate" : this.form.controls.rate.value,
        "clientProjectSubteamId" : '',
        "clientProjectSubteamName" : this.form.controls.gang.value,

        "clientId" : '',
        "clientName" : this.form.controls.client.value,
        "commitment" : this.form.controls.commitment.value,
        "wageClassification" : this.form.controls.classification.value,
        "wageRole" : this.form.controls.roleId.value,
        "awardType" : this.form.controls.awardType.value,
        "skils" : skills
      }

      console.log('Payload:',JSON.stringify(payload));
      this.authService.createDemand(JSON.stringify(payload)).subscribe((result) => {
        console.log('Demad return:',result);
      });
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


  searchEmployee(event: any) {
    console.log(event, 'test')
    this.employeeService.searchEmployee(event.target.value).subscribe((result: any) => {
      console.log(result, 'resukt employee')
      this.managers = result;
    });
  }

  searchClient(event: any) {
    console.log(event, 'test')
    this.jobService.getAllClient(event.target.value).subscribe((result: any) => {
      console.log(result, 'resukt employee')
      this.clients = result;
    });
  }

  goToDemandBoard(){
    this.dialog.closeAll();
    this.router.navigate(['/registration/job-recommend']);
  }

}
