import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-developer-info',
  templateUrl: './developer-info.component.html',
  styleUrls: ['./developer-info.component.scss'],
})
export class DeveloperInfoComponent {
  user:any={};
  constructor(private authService:AuthenticationService) {
    this.user=this.authService.getCurrentUser()
  }
}
