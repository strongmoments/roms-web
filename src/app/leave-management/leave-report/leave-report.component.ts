import { Component, ViewChild } from '@angular/core';
declare var require: any;
const data: any = require('src/assets/company.json');

@Component({
  selector: 'app-table-filter',
  templateUrl: './leave-report.component.html',
  // styleUrls: ['./table-filter.component.scss'],
})
export class LeaveReportComponent {
  editing: any[] = [];
  rows: any[] = [];
  temp = [...data];

  loadingIndicator = true;
  reorderable = true;

  columns = [{ prop: 'name' }, { name: 'Gender' }, { name: 'Company' }];
  @ViewChild(LeaveReportComponent, { static: true }) table: LeaveReportComponent =
    Object.create(null);

  constructor() {
    this.rows = data;
    this.temp = [...data];
    setTimeout(() => {
      this.loadingIndicator = false;
    }, 1500);
  }

  updateFilter(event: any): void {
    const val = event.target.value.toLowerCase();
    // filter our data
    // tslint:disable-next-line - Disables all
    const temp = this.temp.filter(function (d: any) {
      // tslint:disable-next-line - Disables all
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table = data;
  }

  updateValue(event: any, cell: string, rowIndex: number): void {
    console.log('inline editing rowIndex', rowIndex);
    // // // this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
    console.log('UPDATED!', this.rows[rowIndex][cell]);
  }
}
