import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user!: any;
  dashboardData: any = {};
  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.authService.getDashboard().subscribe((result: any) => {
      this.dashboardData = result;
    });
  }

}
