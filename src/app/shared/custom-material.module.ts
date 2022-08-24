import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatTabsModule} from '@angular/material/tabs';
import {MatRadioModule} from '@angular/material/radio';

export const MY_FORMATS = {
    parse: {
        dateInput: 'DD MMM YYYY',
    },
    display: {
        dateInput: 'DD MMM YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY'
    }
};

@NgModule({
    imports: [
        CommonModule,
        MatProgressBarModule,
        MatSnackBarModule, MatProgressSpinnerModule, MatDatepickerModule,
        MatAutocompleteModule, MatTableModule, MatDialogModule,
        MatPaginatorModule, MatSortModule, MatStepperModule,
        MatButtonModule, MatInputModule, MatIconModule, MatSelectModule,
        MatListModule, MatToolbarModule, MatTooltipModule, MatCardModule,
        MatSidenavModule, MatSlideToggleModule, MatMenuModule,
        MatChipsModule, MatNativeDateModule, MatExpansionModule,
        FlexLayoutModule,
        MatTabsModule,MatRadioModule
    ],
    exports: [
        CommonModule,
        MatProgressBarModule, MatSortModule, MatStepperModule,
        MatSnackBarModule, MatProgressSpinnerModule, MatDatepickerModule,
        MatAutocompleteModule, MatTableModule, MatDialogModule, MatPaginatorModule,
        MatButtonModule, MatInputModule, MatIconModule, MatSelectModule,
        MatListModule, MatToolbarModule, MatTooltipModule, MatCardModule,
        MatSidenavModule, MatSlideToggleModule, MatMenuModule,
        MatChipsModule, MatNativeDateModule, MatExpansionModule,FlexLayoutModule ,
        MatTabsModule,MatRadioModule
    ],
    providers: [
        {
            provide: MAT_DATE_LOCALE,
            useValue: MY_FORMATS
        },
        {
            provide: MAT_DATE_LOCALE,
            useValue: 'en-GB'
        },
        { provide: LOCALE_ID, useValue: 'en-gb' }
    ],
    declarations: []
})
export class CustomMaterialModule {
    static forRoot() {
        return {
            ngModule: CustomMaterialModule,
            providers: [
            ]
        };
    }
}
