import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, EmployeeService } from 'src/app/core/services';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { CustomMessage } from 'src/app/custom-message';

@Component({
  selector: 'app-employee-view',
  templateUrl: './employee-view.component.html',
  styleUrls: ['./employee-view.component.css']
})
export class EmployeeViewComponent  implements OnInit {
  panelOpenState = false;
  step = 0;
  record: any;
  user: any;
  id: string = "";
  currentAddress: any;
  postalAddress: any;
  residentialAddress: any;
  isEditEnable:boolean=false;
  constructor(private activatedRoute: ActivatedRoute, private employeeService: EmployeeService, private router: Router, private alertService: AlertService, private authService: AuthenticationService) {
    this.user = this.authService.getCurrentUser();
    
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.activatedRoute.queryParams.subscribe((params: any) => {
      console.log(params);
      if (params['id']) {
        this.id = params['id'];
        this.employeeService.getByIdPersonalInfo(params['id']).subscribe((result: any) => {
          this.record = result;
          if (this.record && this.record.address) {
            this.currentAddress = this.record.address.find((elem: any) => elem.type == 2);
            this.postalAddress = this.record.address.find((elem: any) => elem.type == 1);
            this.residentialAddress = this.record.address.find((elem: any) => elem.type == 1);

          }
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

  redirect() {
    console.log(this.user)
    if (this.user.id == this.id) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/employee/profile'], { queryParams: { id: this.id } });

    }
  }
}
