import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FullComponent } from '../layouts/full/full.component';
import { ClientListComponent } from './client-list/client-list.component';

const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: 'list',
        component: ClientListComponent,
        data: {
          title: 'list',
          urls: [{ title: 'Dashboard', }],
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


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class ClientRoutingModule { }
  