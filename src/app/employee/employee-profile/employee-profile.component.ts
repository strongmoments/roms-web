import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, EmployeeService } from 'src/app/core/services';
import { CustomMessage } from 'src/app/custom-message';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.scss']
})
export class EmployeeProfileComponent implements OnInit {
  record: any = { name: '12' };
  id: string = '';
  constructor(private activatedRoute: ActivatedRoute, private employeeService: EmployeeService, private router: Router, private alertService: AlertService) {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      console.log(params);
      if (params['id']) {
        this.employeeService.getById(params['id']).subscribe((result: any) => {
          this.record = result;
          console.log(result);
        }, (error: any) => {
          this.alertService.openSnackBar(CustomMessage.recordNotFound);
          this.router.navigate(['/dashboard']);
        });
      } else {
        this.router.navigate(['/dashboard']);
      }
    })
  }

  ngOnInit(): void {
  }

}
