import { Component, OnInit,TemplateRef, ViewChild  } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { EmployeeService, JobService } from 'src/app/core/services';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { first } from 'rxjs';
import { ViewOptions } from 'src/app/_models';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { environment } from "src/environments/environment";
export interface DemoColor {
  name: string;
  color: string;
}
@Component({
  selector: 'app-recommend',
  templateUrl: './recommend.component.html',
  styleUrls: ['./recommend.component.scss']
})
export class RecommendComponent {
  @ViewChild('recommendDialog') recommendDialog!: TemplateRef<any>;
  submitted: boolean = false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  employeeList: any = [];
  demandDetails : any = {};
  id : string = ''; 

  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];

  selectedEmployee : any = null;
  environmentUrl = environment.apiUrl;

  fruits = [{ name: 'Lemon' }, { name: 'Lime' }, { name: 'Apple' }];

  availableColors: DemoColor[] = [
    { name: 'none', color: '' },
    { name: 'Primary', color: 'primary' },
    { name: 'Accent', color: 'accent' },
    { name: 'Warn', color: 'warn' },
  ];

  constructor(private employeeService: EmployeeService, private activatedRoute: ActivatedRoute, 
    private jobService: JobService, private router: Router,private dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.id = params['dId'];
    });
    console.log('Inside recomment id:',this.id);
    this.getDemandDetails();
  }

  getDemandDetails(){
    this.jobService.getDemandDetails(this.id).pipe(first())
        .subscribe((result: any) => {
          this.demandDetails = result.data;
          console.log('Demand Details:',this.demandDetails);
        });
  }


  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.fruits.push({ name: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  displayFn(item?: any): string | undefined {
    return  undefined;
  }

  searchSelfEmployee(event: any) {
    console.log(event.target.value, 'event')
    this.employeeList = [];
    if (event.target.value) {
      this.employeeService.searchEmployeeUnderManager(event.target.value).subscribe((result: any) => {
        this.employeeList = result ? result.data : [];
        console.log(result)
      });
      return true;
    }
  }

  onEmployeeSelect(event: MatAutocompleteSelectedEvent){
    this.selectedEmployee = this.employeeList.filter((emp : any) => emp.id == event.option.value)[0];
    console.log('Selected employee:',this.selectedEmployee);
    this.getEmployeeGangDetails(event.option.value);
  }

  getEmployeeGangDetails(empId: any){
    if (empId) {
      this.employeeService.getEmployeeGangDetails(empId).subscribe((result: any) => {
        this.selectedEmployee.subteam = result;
      });
    }
  }

  remove(fruit: any): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  getImageUrl(){
    return this.environmentUrl+ this.selectedEmployee?.profileImage[0]?.digitalAssets?.url;
  }

  recommendEmployee(){
    let resourceDemandId = this.id;
    let employeeId = this.selectedEmployee.id;
    let subTeamId = this.selectedEmployee.subteam?.gangDetails?.id;

    if(resourceDemandId && employeeId && subTeamId){
      let inputPayload = {
        "employeeId": employeeId,
        "resourceDemandId": resourceDemandId,
        "subTeamId": subTeamId
      }

      this.employeeService.recommendEmployee(inputPayload).subscribe((result: any) => {
        console.log('Employee gang Details:',result);
        this.openDialog();
      },
      (error: any) => {
        alert('Already requested');
      },);
    }
    else{
      alert('Employee gang details are not found.');
    }

  }
  onSubmit() {
    this.submitted = true;
    this.openDialog();
    // if (this.form.invalid) {
    //   this.alertService.openSnackBar(CustomMessage.invalidForm);
    //   return;
    // }
  }

  openDialog() {
    const dialogRef = this.dialog.open(this.recommendDialog, {
      width: '30em',
      height: '15em',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // this.router.navigate(['/registration/list']);
      console.log('The dialog was closed');
    });
  }

  goToDemandBoard(){
    this.dialog.closeAll();
    this.router.navigate(['/registration/job-recommend']);
  }

}
