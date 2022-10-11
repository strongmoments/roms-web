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
export class EmployeeViewComponent implements OnInit {
  record: any;
  user:any;
  id:string="";
  constructor(private activatedRoute: ActivatedRoute, private employeeService: EmployeeService, private router: Router, private alertService: AlertService,private authService:AuthenticationService) {
    this.user=this.authService.getCurrentUser();
    this.activatedRoute.queryParams.subscribe((params: any) => {
      console.log(params);
      if (params['id']) {
        this.id=params['id'];
        this.employeeService.getByIdPersonalInfo(params['id']).subscribe((result: any) => {
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

  redirect(){
    console.log(this.user)
    if(this.user.id == this.id){
this.router.navigate(['/profile']);
    }else{
      this.router.navigate(['/employee/profile'],{queryParams:{id:this.id}});
      
    }
  }
}
