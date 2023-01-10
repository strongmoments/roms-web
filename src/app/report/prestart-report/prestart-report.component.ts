import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Globals } from 'src/app/globals';

@Component({
  selector: 'app-prestart-report',
  templateUrl: './prestart-report.component.html',
  styleUrls: ['./prestart-report.component.scss']
})
export class PrestartReportComponent implements OnInit {
  // globals: Globals;
  submitted: boolean = false;
  displayedColumns: string[] = [
    'inspectionName',
    'response',
    'remark',
    'media',
    'action',
    
  ];

  // convertedStartDate: convertedStartDate,
  // employeeName: employeeName,

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  panelOpenState = false;
  step = 0;

  setStep(index: number): void {
    this.step = index;
  }

  nextStep(): void {
    this.step++;
  }

  prevStep(): void {
    this.step--;
  }
  constructor(
    // breakpointObserver: BreakpointObserver,
    // public util: Utils,
    globals: Globals,
    // private fb: FormBuilder,
    // private alertService: AlertService,
    // private leaveService: LeaveService,
    // private datePipe: DatePipe,
    // private activatedRoute: ActivatedRoute,
    // private authService: AuthenticationService,
    // private employeeService: EmployeeService,
    // private router: Router,
    ) { }

  ngOnInit(): void {
  }

}
