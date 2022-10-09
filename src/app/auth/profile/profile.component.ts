import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, EmployeeService } from 'src/app/core/services';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { CustomMessage } from 'src/app/custom-message';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  record:any={};
  user:any={};
  constructor(private authService:AuthenticationService,private employeeService:EmployeeService,private alertService:AlertService,private router:Router) {
    this.user=this.authService.getUserData();
   
    // console.log(this.user.userDetail.id);
    
   }

  ngOnInit(): void {
  this.employeeService.getById(this.user.userDetail.id).subscribe((result: any) => {
      this.record = result;
      console.log(result);
    }, (error: any) => {
      this.alertService.openSnackBar(CustomMessage.recordNotFound);
      this.router.navigate(['/dashboard']);
    });
  }

}
