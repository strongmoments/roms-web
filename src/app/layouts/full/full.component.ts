import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Menu, MenuItems } from '../../shared/menu-items/menu-items';

import { PerfectScrollbarConfigInterface, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { Globals } from 'src/app/globals';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { environment } from 'src/environments/environment';

/** @title Responsive sidenav */
@Component({
  selector: 'app-full-layout',
  templateUrl: 'full.component.html',
  styleUrls: [],
})
export class FullComponent implements OnDestroy, OnInit {
  mobileQuery: MediaQueryList;
  userName!: string;
  user!: any;
  globals!: Globals;
  userPermissions: any = {};
  server: string = environment.server;
  dir = 'ltr';
  dark = false;
  minisidebar = false;
  boxed = false;
  horizontal = false;

  green = false;
  blue = false;
  danger = false;
  showHide = false;
  url = '';
  sidebarOpened = false;
  status = false;
  menuItems: Menu[] = [];

  public showSearch = false;
  public config: PerfectScrollbarConfigInterface = {};
  // tslint:disable-next-line - Disables all
  private _mobileQueryListener: () => void;

  constructor(
    public router: Router,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    // public menuItems: MenuItems,
    private authService: AuthenticationService
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 1100px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    // tslint:disable-next-line: deprecation
    this.mobileQuery.addListener(this._mobileQueryListener);
    // this is for dark theme
    // const body = document.getElementsByTagName('body')[0];
    // body.classList.toggle('dark');
    this.dark = false;
  }

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();

    if (this.user === null || this.user === undefined) {
      this.authService.logout();
      this.router.navigate(['/']);
    }

  }

  ngOnDestroy(): void {
    // tslint:disable-next-line: deprecation
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  clickEvent(): void {
    this.status = !this.status;
  }

  darkClick() {
    // const body = document.getElementsByTagName('body')[0];
    // this.dark = this.dark;
    const body = document.getElementsByTagName('body')[0];
    body.classList.toggle('dark');
    // if (this.dark)
    // else
    // 	body.classList.remove('dark');
    // this.dark = this.dark;
    // body.classList.toggle('dark');
    // this.dark = this.dark;
  }
}
