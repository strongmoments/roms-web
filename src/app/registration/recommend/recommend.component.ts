import { Component, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { EmployeeService, JobService } from 'src/app/core/services';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs';
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

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  employeeList: any = [];
  demandDetails : any = {};
  id : string = ''; 

  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];

  fruits = [{ name: 'Lemon' }, { name: 'Lime' }, { name: 'Apple' }];

  availableColors: DemoColor[] = [
    { name: 'none', color: '' },
    { name: 'Primary', color: 'primary' },
    { name: 'Accent', color: 'accent' },
    { name: 'Warn', color: 'warn' },
  ];

  constructor(private employeeService: EmployeeService, private activatedRoute: ActivatedRoute, 
    private jobService: JobService) {

  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.id = params['id'];
    });
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

  search(event: any) {
    console.log(event.target.value, 'event')
    this.employeeList = [];
    if (event.target.value) {
      this.employeeService.searchEmployeeByName(event.target.value).subscribe((result: any) => {
        this.employeeList = result ? result : [];
        console.log(result)
      });
      return true;
    }
  }

  remove(fruit: any): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }
}
