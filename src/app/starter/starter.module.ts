import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarterComponent } from './starter.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from 'angular-6-datatable';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [StarterComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DataTableModule,
    RouterModule,
    NgxSpinnerModule
  ]
})
export class StarterModule { }
