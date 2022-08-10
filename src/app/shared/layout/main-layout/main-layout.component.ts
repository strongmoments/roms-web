import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/core/services';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { Globals } from 'src/app/globals';
import { NavItem } from 'src/app/_models';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {
  mobileQuery!: MediaQueryList;
  userName!: string;
  user!: any;
  imageSrc: string = "";
  selectedFile!: File;
  email!: string;
  isAdmin: boolean = false;
  globals!: Globals;
  sideNavOpened = true;
  sideNavMode: 'side' | 'over' = 'side';
  toolBarHeight = 64;
  navItems: NavItem[] = [];
  companyName!: string;


  private readonly mediaWatcher!: Subscription;

  constructor(private changeDetectorRef: ChangeDetectorRef, media: MediaObserver,
    private router: Router, private authService: AuthenticationService,
    private alertService: AlertService, globals: Globals,) {
    this.globals = globals;
    this.mediaWatcher = media.media$.subscribe((change: MediaChange) => {
      if (change.mqAlias === 'sm' || change.mqAlias === 'xs') {
        if (this.sideNavOpened) {
          this.sideNavOpened = false;
        }
        this.sideNavMode = 'over';
      } else {
        this.sideNavOpened = true;
        this.sideNavMode = 'side';
      }
      if (change.mqAlias === 'xs') {
        this.toolBarHeight = 56;
      } else {
        this.toolBarHeight = 64;
      }
    });

    this.isAdmin = false;
    this.userName = "";
  }

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();

    // if (this.user === null || this.user === undefined) {
    //   this.authService.logout();
    //   this.router.navigate(['/']);
    // }

    this.userName = this.user.fullName;
    this.email = this.user.email;
    this.companyName = this.user.companyName;

    this.navItems.push({ displayName: 'Dashboard', iconName: 'dashboard', route: '/' },
      {
        displayName: 'Time Off', iconName: 'calendar_today', route: '/', children: [
          { displayName: 'My Leaves', iconName: '', route: '/leave' },
          { displayName: 'Holidays', iconName: '', route: '/' },
        ]
      },
      {
        displayName: 'My Staff', iconName: 'dashboard', route: '/', children: [
          { displayName: 'Leave Request', iconName: 'account_box', route: '/leave' },
        ]
      },
      {
        displayName: 'Operation', iconName: 'dashboard', route: '/', children: [
          { displayName: 'Asset', iconName: 'account_box', route: '/' },
          { displayName: 'Inspection', iconName: 'account_box', route: '/' },
        ]
      }
    );


    // const accountSetting = {
    //   displayName: 'Account Settings ', iconName: 'settings', route: '/', children: [
    //     { displayName: 'Profile', iconName: 'account_box', route: '/profile' },
    //     { displayName: 'Change Password', iconName: 'settings', route: '/changePassword' }
    //   ]
    // }


    // this.navItems.push(accountSetting);


  }


  onLoggedOut() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.mediaWatcher.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
  }
}
