import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientListComponent } from './client-list/client-list.component';
import {ClientRoutingModule } from './client.routing';
import { SharedModule } from '../shared/shared.module';
import { ClientAddComponent } from './client-add/client-add.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectAddComponent } from './project-add/project-add.component';



@NgModule({
  declarations: [
    ClientListComponent,
    ClientAddComponent,
    ProjectListComponent,
    ProjectAddComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ClientRoutingModule
  ]
})
export class ClientModule { }
