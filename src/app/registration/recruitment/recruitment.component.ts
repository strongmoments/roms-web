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
  contracts: any = [];
  projects: any = [];
  gangs: any = [];

  selectedClientId = '';
  selectedContractId = '';
  selectedProjectId = '';
  selectedGangId = '';

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

  dialogData : any;

  dateStartAt = new Date();
  selectedButton = 0;

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

    this.searchHiringManager({ target: { value: '' } });
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
      this.dialogData = {};
  }

  ngOnInit(): void {

  }

  setToday(){
    console.log('Inside today');
    this.dateStartAt = new Date();
    this.form.controls.propsedStartDate.setValue(this.dateStartAt);
    this.selectedButton = 1;
  }

  setTomorrow(){
    this.dateStartAt = new Date(new Date().setDate(new Date().getDate() + 1));
    this.form.controls.propsedStartDate.setValue(this.dateStartAt);
    this.selectedButton = 2;
  }

  setNextMonday(){
    this.dateStartAt = new Date();
    this.dateStartAt.setDate(this.dateStartAt.getDate() + (((1 + 7 - this.dateStartAt.getDay()) % 7) || 7));
    this.form.controls.propsedStartDate.setValue(this.dateStartAt);
    this.selectedButton = 3;
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

  getDescription(event: any){
    console.log('Editor:',event);
  }
  onSubmit() {
    this.submitted = true;
    console.log('Client:',this.form.controls.description);
    // this.openDialog({});

    if (this.form.invalid) {
      this.alertService.openSnackBar(CustomMessage.invalidForm);
      return;
    }
    else{

      let certString = ''
      this.selectedCertifications.forEach((ele:any, i: number) => {
        if(i == 0){
          certString =  '{"' + ele.code + '":"' + ele.name + '"';
        }
        // else if(certLength - 1 == i){
        //   certString = certString + ',"' + ele.code + '":"' + ele.name + '"}';
        // }
        else{
          certString = certString + ',"' + ele.code + '":"' + ele.name + '"';
        }
      });
      certString = certString + '}';

      let licenseString = ''
      this.selectedLicenses.forEach((ele:any, i: number) => {
        if(i == 0){
          licenseString =  '{"' + ele.code + '":"' + ele.name + '"';
        }
        // else if(licenseLength - 1 == i){
        //   licenseString = licenseString + ',"' + ele.code + '":"' + ele.name + '"}';
        // }
        else{
          licenseString = licenseString + ',"' + ele.code + '":"' + ele.name + '"';
        }
      });
      licenseString = licenseString + '}';

      let ticketString = ''
      this.selectedTickets.forEach((ele:any, i: number) => {
        if(i == 0){
          ticketString =  '{"' + ele.code + '":"' + ele.name + '"';
        }
        // else if(ticketLength - 1 == i){
        //   ticketString = ticketString + ',"' + ele.code + '":"' + ele.name + '"}';
        // }
        else{
          ticketString = ticketString + ',"' + ele.code + '":"' + ele.name + '"';
        }
      });
      ticketString = ticketString + '}';

      let skills = {
        "certification": JSON.parse(certString),
        "licenses": JSON.parse(licenseString),
        "plantTicket": JSON.parse(ticketString)
      }

      let payload = {
        "hiringManagerId" : this.form.controls.managerId.value,
        "demandType" : this.form.controls.demandType.value,
        "profileRole" : this.form.controls.demandTitle.value,
        "perposedDate" : moment(this.form.controls.propsedStartDate.value).format('DD/MM/YYYY'),
        "description" : this.form.controls.description.value,
        "type" : '',

        "classification" :'',
        "minimumExperiecne" : this.form.controls.minExperience.value,
        "clientProjectName" : this.form.controls.project.value.name,
        "clientProjectNameId" : this.selectedProjectId,
        "locationName" : this.form.controls.location.value,
        "contractName" : this.form.controls.contractType.value.name,

        "contractId" : this.selectedContractId,
        "clientProjectRoleId" : '',
        "clientProjectRoleName" : '',
        "rate" : this.form.controls.rate.value,
        "clientProjectSubteamId" : this.selectedGangId,
        "clientProjectSubteamName" : this.form.controls.gang.value.teamName,

        "clientId" : this.selectedClientId,
        "clientName" : this.form.controls.client.value.name,
        "commitment" : this.form.controls.commitment.value,
        "wageClassification" : this.form.controls.classification.value,
        "wageRole" : this.form.controls.roleId.value,
        "awardType" : this.form.controls.awardType.value,
        "skils" : skills
      }

      console.log('Payload:',JSON.stringify(payload));
      this.authService.createDemand(JSON.stringify(payload)).subscribe((result) => {
        console.log('Demad return:',result);
        this.dialogData = result;
        this.resetForm();
        this.openDialog();
      });
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(this.resourceDemandDialog, {
      width: '30em',
      height: '20em'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // this.router.navigate(['/registration/list']);
      console.log('The dialog was closed');
    });
  }


  // searchEmployee(event: any) {
  //   console.log(event, 'test')
  //   this.employeeService.searchEmployee(event.target.value).subscribe((result: any) => {
  //     console.log(result, 'resukt employee')
  //     this.managers = result;
  //   });
  // }

  searchHiringManager(event: any) {
    this.employeeService.searchHiringManager(event.target.value).subscribe((result: any) => {
      this.managers = result;
    });
  }

  searchClient(event: any) {
    console.log(event, 'test')
    this.jobService.getAllClient(event.target.value).subscribe((result: any) => {
      this.clients = result;
    });

  }

  onClientSelect(event: any){
    console.log('Selected Client id:',event);
    this.selectedClientId = event.id;
    this.searchContract('');
  }

  searchContract(event: any){
    if(this.selectedClientId && this.selectedClientId != ''){
      let searchText = event?.target?.value;
      this.jobService.getAllClientContract(this.selectedClientId,searchText ? searchText : '').subscribe((result: any) => {
        this.contracts = result;
      });
    }
  }

  onContractSearch(event: any){
    console.log('Selected contract id:',event);
    this.selectedContractId = event.id;
    this.searchProject('');
  }

  searchProject(event: any){
    if(this.selectedClientId && this.selectedClientId != '' && this.selectedContractId && this.selectedContractId != ''){
      let searchText = event?.target?.value;
      this.jobService.getAllClientContractProject(this.selectedClientId,this.selectedContractId,searchText ? searchText : '').subscribe((result: any) => {
        this.projects = result;
      });
    }
  }

  onProjectSearch(event: any){
    this.selectedProjectId = event.id;
    this.form.controls.location.setValue(event?.location?.description);
    this.searchGang('');
  }

  searchGang(event: any){
    if(this.selectedProjectId && this.selectedProjectId != ''){
      let searchText = event?.target?.value;
      this.jobService.getAllGang(this.selectedProjectId,searchText ? searchText : '').subscribe((result: any) => {
        this.gangs = result;
      });
    }
  }

  onGangSelect(event: any){
    this.selectedGangId = event.id;
    this.form.controls.classification.setValue(event?.wageClassification);
    this.form.controls.roleId.setValue(event?.wageRole);
    this.form.controls.awardType.setValue(event?.awardType);
  }

  goToDemandBoard(){
    this.dialog.closeAll();
    this.router.navigate(['/registration/job-recommend']);
  }

  resetForm(){
    this.submitted = false;
    this.form.reset();
    this.selectedCertifications.length = 0;
    this.selectedLicenses.length = 0;
    this.selectedTickets.length = 0;
  }

}
