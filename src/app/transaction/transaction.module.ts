import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewTransactionComponent } from './view-transaction/view-transaction.component';
import { DataTablesModule } from 'angular-datatables';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
@NgModule({
  declarations: [ViewTransactionComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ]
})
export class TransactionModule { }
