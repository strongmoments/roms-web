import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-top-card',
  templateUrl: './top-card.component.html',
  styleUrls: ['./top-card.component.scss'],
})
export class TopCardComponent {
  dashboardData: any = {};
  constructor(private authService: AuthenticationService) {
    this.authService.getDashboard().subscribe((result: any) => {
      this.dashboardData = result;
      console.log(result);
    });
  }
}
