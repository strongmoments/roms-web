import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { NotificationComponent } from './notification.component';
import { NotificationRoutingModule } from './notification.routing';

@NgModule({
  imports: [CommonModule, SharedModule, NotificationRoutingModule],
  declarations: [NotificationComponent],
})
export class NotificationModule {}
