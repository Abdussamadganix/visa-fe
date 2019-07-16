import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleComponent } from './role.component';
import { ReactiveFormsModule } from '@angular/forms';
import {DataTableModule} from 'angular-6-datatable';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [RoleComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DataTableModule,
    NgxSpinnerModule,
  ]
})
export class RoleModule { }
