import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FullComponent } from '../layouts/full/full.component';
import { ClientAddComponent } from './client-add/client-add.component';
import { ClientListComponent } from './client-list/client-list.component';
import { ProjectAddComponent } from './project-add/project-add.component';
import { ProjectListComponent } from './project-list/project-list.component';

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
          urls: [{ title: 'Dashboard', url: '/' }, { title: 'My Staff' }],
      },
      },
      {
        path: 'client-add',
        component: ClientAddComponent,
       data: {
          title: 'Add Client',
          urls: [{ title: 'Dashboard', url: '/' }, { title: 'My Staff' }],
      },
      },
      {
        path: 'project-add',
        component: ProjectAddComponent,
       data: {
          title: 'Add Project',
          urls: [{ title: 'Dashboard', url: '/' }, { title: 'My Staff' }],
      },
      },
      {
        path: 'project-list',
        component: ProjectListComponent,
       data: {
          title: 'Project List',
          urls: [{ title: 'Dashboard', url: '/' }, { title: 'My Staff' }],
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
  