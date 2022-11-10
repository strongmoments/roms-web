import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FullComponent } from '../layouts/full/full.component';
import { ClientAddComponent } from './client-add/client-add.component';
import { ClientListComponent } from './client-list/client-list.component';
import { ProjectAddComponent } from './project-add/project-add.component';
import { ProjectListComponent } from './project-list/project-list.component';

import { AssetsListComponent } from './assets-list/assets-list.component';
import { AssetsAddComponent } from './assets-add/assets-add.component';
import { InspectionListComponent } from './inspection-list/inspection-list.component';

const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: 'client-list',
        component: ClientListComponent,
        data: {
          title: 'Client list',
          urls: [{ title: 'Dashboard', url: '/' }, { title: 'Operations' }],
      },
      },
      {
        path: 'client-add',
        component: ClientAddComponent,
       data: {
          title: 'Add Client',
          urls: [{ title: 'Dashboard', url: '/' }, { title: 'Operations' }],
      },
      },
      {
        path: 'project-add',
        component: ProjectAddComponent,
       data: {
          title: 'Add Project',
          urls: [{ title: 'Dashboard', url: '/' }, { title: 'Operations' }],
      },
      },
      {
        path: 'project-list',
        component: ProjectListComponent,
       data: {
          title: 'Project List',
          urls: [{ title: 'Dashboard', url: '/' }, { title: 'Operations' }],
      },
      },
      {
        path: 'assets-list',
        component: AssetsListComponent,
       data: {
          title: 'Assets List',
          urls: [{ title: 'Dashboard', url: '/' }, { title: 'Operations' }],
      },
      },
      {
        path: 'assets-add',
        component: AssetsAddComponent,
       data: {
          title: 'Asset Add',
          urls: [{ title: 'Dashboard', url: '/' }, { title: 'Operations' }],
      },
      },
      {
        path: 'inspection-list',
        component: InspectionListComponent,
       data: {
          title: 'Inspection List',
          urls: [{ title: 'Dashboard', url: '/' }, { title: 'Operations' }],
      },
      },
     
    ],
  },
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class ClientRoutingModule { }
  