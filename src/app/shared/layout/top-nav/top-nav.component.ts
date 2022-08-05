import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html' ,
  styleUrls: ['./top-nav.component.css']
  
})

export class TopNavComponent implements OnInit, OnDestroy {
  isCollapsed: Boolean = false;
  notification: Notification[] = [];
  @Output() sideNavToggled = new EventEmitter<void>();
  private autoLogoutSubscription!: Subscription;
  rememberMe: String = 'no';

  constructor(private readonly router: Router, private authService: AuthenticationService,) {
    this.autoLogoutSubscription = new Subscription();
    this.rememberMe = this.authService.getRememberMe();

  }

  ngOnInit() {


  }

  toggleSidebar() {
    this.sideNavToggled.emit();
  }

  onLoggedout() {
    this.authService.logout();
  }
  changePassword() {
    this.router.navigateByUrl('/changePassword')
  }
  changeProfile() {
     this.router.navigateByUrl('/profile')
  }

  ngOnDestroy(): void {
    this.autoLogoutSubscription.unsubscribe();
  }
}
