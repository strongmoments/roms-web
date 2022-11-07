import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientListComponent } from './client-list/client-list.component';
import {ClientRoutingModule } from './client.routing';
import { SharedModule } from '../shared/shared.module';
import { ClientAddComponent } from './client-add/client-add.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectAddComponent } from './project-add/project-add.component';
import { AssetsListComponent } from './assets-list/assets-list.component';



@NgModule({
  declarations: [
    ClientListComponent,
    ClientAddComponent,
    ProjectListComponent,
    ProjectAddComponent,
    AssetsListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ClientRoutingModule
  ]
})
export class ClientModule { }
