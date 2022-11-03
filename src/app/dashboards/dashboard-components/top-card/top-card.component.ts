import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-top-card',
  templateUrl: './top-card.component.html',
  styleUrls: ['./top-card.component.scss'],
})
export class TopCardComponent {
  dashboardData: any = {};
  constructor(private authService: AuthenticationService,private router: Router) {
    this.authService.getDashboard().subscribe((result: any) => {
      this.dashboardData = result;
      console.log(result);
    });
  }

  redirect() {
    console.log(this)
      this.router.navigate(['/employee/employee-list']);
    } ;

    
  
}

