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
  userPermissions: any = {};

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
    this.userPermissions = this.authService.getUserPermission()?.menus;
    console.log(this.userPermissions, 'this.userPermissions')
    if (this.user === null || this.user === undefined) {
      this.authService.logout();
      this.router.navigate(['/']);
    }
    console.log(this.user)
    this.userName = this.user.fullName;
    this.email = this.user.email;
    this.companyName = this.user.companyName;

    let menuItem = [];

    menuItem.push({ displayName: 'Dashboard', iconName: 'dashboard', route: '/dashboard' });

    if (this.userPermissions) {
      //condition for menu of operatins
      if (this.userPermissions.operations && this.userPermissions.operations.length > 0) {
        let subMenu = [];
        if (this.userPermissions.operations.includes('assets')) {
          subMenu.push({ displayName: 'Asset', iconName: '', route: '/' });
        }
        if (this.userPermissions.operations.includes('inspection')) {
          subMenu.push({ displayName: 'Inspection', iconName: '', route: '/' });
        }
        // if (this.userPermissions.operations.includes('inspection')) {
        // subMenu.push({
        //   displayName: 'People', iconName: '', route: '/', children: [
        //     {
        //       displayName: 'Transfer', iconName: '', route: '/employee/transfer'
        //     }
        //   ]
        // });
        // }
        menuItem.push({
          displayName: 'Operation', iconName: 'dashboard', route: '/', children: subMenu
        })
      }

      //condition for menu of timeoff
      if (this.userPermissions.timeoff && this.userPermissions.timeoff.length > 0) {
        let subMenu = [];
        if (this.userPermissions.timeoff.includes('applyleave')) {
          subMenu.push({ displayName: 'My Leaves', iconName: '', route: '/leave' });
        }
        if (this.userPermissions.timeoff.includes('history')) {
          subMenu.push({ displayName: 'Holidays', iconName: '', route: '/' });
        }
        menuItem.push({
          displayName: 'Time Off', iconName: 'calendar_today', route: '/', children: subMenu
        })
      }

      //condition for menu of my staff
      if (this.userPermissions.dashboard && this.userPermissions.dashboard.length > 0) {
        let subMenu: any = [];
        if (this.userPermissions.dashboard.includes('mystaff')) {
          subMenu.push({ displayName: 'Leave Request', iconName: 'account_box', route: '/leave/leave-request' });
        }
        // if (this.userPermissions.timeoff.includes('history')) {
        //   subMenu.push({ displayName: 'Holidays', iconName: '', route: '/' });
        // }
        menuItem.push({
          displayName: 'My Staff', iconName: 'dashboard', route: '/', children: subMenu
        })
      }
    }

    // this.navItems.push({ displayName: 'Dashboard', iconName: 'dashboard', route: '/' },
    //   {
    //     displayName: 'My Staff', iconName: 'dashboard', route: '/', children: [
    //       { displayName: 'Leave Request', iconName: 'account_box', route: '/leave/leave-request' },
    //     ]
    //   },
    // );


    // const accountSetting = {
    //   displayName: 'Account Settings ', iconName: 'settings', route: '/', children: [
    //     { displayName: 'Profile', iconName: 'account_box', route: '/profile' },
    //     { displayName: 'Change Password', iconName: 'settings', route: '/changePassword' }
    //   ]
    // }
    console.log(menuItem)
    this.navItems = menuItem;

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
