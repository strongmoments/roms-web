import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { Globals } from 'src/app/globals';

@Component({
  selector: 'app-developer-info',
  templateUrl: './developer-info.component.html',
  styleUrls: ['./developer-info.component.scss'],
})
export class DeveloperInfoComponent {
  user:any={};
  globals:Globals;
  constructor(private authService:AuthenticationService,private global:Globals) {
    this.globals=global;
    this.user=this.authService.getCurrentUser()
  }
}
