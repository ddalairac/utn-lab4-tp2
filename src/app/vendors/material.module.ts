
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
// import { MatMomentDateModule } from '@angular/material-moment-adapter';

@NgModule({
    exports: [
        MatFormFieldModule,
        // MatAutocompleteModule,
        MatButtonModule,
        MatButtonToggleModule,
        // MatCardModule,
        MatCheckboxModule,
        // MatChipsModule,
        // MatStepperModule,
        // MatDatepickerModule,
        MatDialogModule,
        // MatDividerModule,
        // MatExpansionModule,
        // MatGridListModule,
        MatIconModule,
        MatInputModule,
        // MatListModule,
        // MatMenuModule,
        // MatNativeDateModule,
        // MatPaginatorModule,
        // MatProgressBarModule,
        MatProgressSpinnerModule,
        // MatRadioModule,
        // MatRippleModule,
        MatSelectModule,
        // MatSidenavModule,
        MatSliderModule,
        // MatSlideToggleModule,
        MatSnackBarModule,
        // MatSortModule,
        MatTableModule,
        MatTabsModule,
        // MatToolbarModule,
        MatTooltipModule,
        // MatMomentDateModule
    ],
    declarations: []
})
export class MaterialModule { }

