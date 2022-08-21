import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomMaterialModule } from './custom-material.module';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { ConfirmationDialog } from './confirmation-dialog/confirmation-dialog.component';
import { LoginLayoutComponent } from './layout/login-layout/login-layout.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { SpinnerOverlayComponent } from './spinner-overlay/spinner-overlay.component';
import { SnackbarComponent } from './snackbar.component/snackbar.component.component';
import { TopNavComponent } from './layout/top-nav/top-nav.component';
import { MenuListItemComponent } from './layout/menu-list-item/menu-list-item.component';
import { TextMaskModule } from 'angular2-text-mask';
import { CustomJavaDatePipe } from '../core/_helpers/custom-java-date-pipe';
 
@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        CustomMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        TextMaskModule
    ],
    declarations: [
        AlertDialogComponent,
        SpinnerOverlayComponent,
        ConfirmationDialog,
        LoginLayoutComponent,
        MainLayoutComponent,
        SnackbarComponent,
        TopNavComponent,
        MenuListItemComponent,
        CustomJavaDatePipe
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        CustomMaterialModule,
        SnackbarComponent,
        TopNavComponent,
        TextMaskModule,
        CustomJavaDatePipe
    ]
})
export class SharedModule { }
