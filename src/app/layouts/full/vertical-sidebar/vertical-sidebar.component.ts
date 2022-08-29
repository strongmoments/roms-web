import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  Output,
  EventEmitter,
  Input,
  OnInit,
} from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { MediaMatcher } from '@angular/cdk/layout';
import { MenuItems } from '../../../shared/menu-items/menu-items';
import { Menu } from 'src/app/shared/menu-items/horizontal-menu-items';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vertical-sidebar',
  templateUrl: './vertical-sidebar.component.html',
  styleUrls: [],
})
export class VerticalAppSidebarComponent implements OnInit, OnDestroy {
  public config: PerfectScrollbarConfigInterface = {};
  mobileQuery: MediaQueryList;

  @Input() showClass: boolean = false;
  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();

  private _mobileQueryListener: () => void;
  status = true;
  showMenu = '';
  itemSelect: number[] = [];
  parentIndex = 0;
  childIndex = 0;
  user: any = {};
  userPermissions: any = {};
  menuItems: Menu[] = [];

  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }

  subclickEvent(): void {
    this.status = true;
  }
  scrollToTop(): void {
    document.querySelector('.page-wrapper')?.scroll({
      top: 0,
      left: 0,
    });
  }

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private authService: AuthenticationService,
    private router: Router
    // public menuItems: MenuItems,
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    // tslint:disable-next-line: deprecation
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    console.log(this.user ,'')
    this.userPermissions = this.authService.getUserPermission()?.menus;
    console.log(this.userPermissions, 'this.userPermissions')

    let menuItem: Menu[] = [];

    menuItem.push({ state: 'dashboard', name: 'Dashboard', type: 'link', icon: 'av_timer' });

    if (this.userPermissions) {
      //condition for menu of operatins
      if (this.userPermissions.operations && this.userPermissions.operations.length > 0) {
        let subMenu = [];
        if (this.userPermissions.operations.includes('assets')) {
          subMenu.push({ state: 'asset', name: 'Assets', type: 'link', icon: 'commute' });
        }
        if (this.userPermissions.operations.includes('inspection')) {
          subMenu.push({ state: 'inspection', name: 'Inspection', type: 'link', icon: 'description' });
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
        menuItem.push({ state: 'operation', name: 'Operation', type: 'sub', icon: 'commute', children: subMenu });
      }

      //condition for menu of timeoff
      if (this.userPermissions.timeoff && this.userPermissions.timeoff.length > 0) {
        let subMenu = [];
        if (this.userPermissions.timeoff.includes('applyleave')) {

          subMenu.push({ state: 'leave', name: 'My Leaves', type: 'link', icon: '' });
          // subMenu.push({ displayName: 'My Leaves', iconName: '', route: '/leave' });
        }
        if (this.userPermissions.timeoff.includes('history')) {
          subMenu.push({ state: 'holiday', name: 'Holidays', type: 'link', icon: '' });

          // subMenu.push({ displayName: 'Holidays', iconName: '', route: '/' });
        }
        menuItem.push(
          { state: '', name: 'Personal', type: 'sub', icon: 'perm_contact_calendar', children: subMenu });
      }

      //condition for menu of my staff
      if (this.userPermissions.dashboard && this.userPermissions.dashboard.length > 0) {
        let subMenu: any = [];
        if (this.userPermissions.dashboard.includes('mystaff')) {
          subMenu.push(
            { state: 'leave/leave-request', name: 'Leave Request', type: 'link', icon: 'account_box' });
        }
        // if (this.userPermissions.timeoff.includes('history')) {
        //   subMenu.push({ displayName: 'Holidays', iconName: '', route: '/' });
        // }
        menuItem.push({ state: '', name: 'My Staff', type: 'sub', icon: 'people', children: subMenu });
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
    this.menuItems = menuItem;
  }

  ngOnDestroy(): void {
    // tslint:disable-next-line: deprecation
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  getRoute(url: string) {
    // this.router.navigate([url]);
    return `/${url.replace(/%/g, '/')}`;
  }
  handleNotify() {
    if (window.innerWidth < 1024) {
      this.notify.emit(!this.showClass);
    }
  }
}
