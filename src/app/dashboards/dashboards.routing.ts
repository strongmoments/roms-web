import { Routes } from '@angular/router';
import { FullComponent } from '../layouts/full/full.component';

import { Dashboard1Component } from './dashboard1/dashboard1.component';
import { Dashboard2Component } from './dashboard2/dashboard2.component';

export const DashboardsRoutes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        component: Dashboard1Component,
        data: {
          title: 'Dashboard',
          urls: [{ title: 'Dashboard' }],
        },
      },
      // {
      //   path: 'dashboard2',
      //   component: Dashboard2Component,
      //   data: {
      //     title: 'Dashboard 2',
      //     urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard 2' }],
      //   },
      // },
    ],
  },
];
