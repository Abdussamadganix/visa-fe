import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetListOfUsersComponent } from './get-list-of-users/get-list-of-users.component';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [GetListOfUsersComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSpinnerModule

  ]
})
export class UserModule { }
