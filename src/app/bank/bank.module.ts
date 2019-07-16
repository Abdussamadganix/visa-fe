import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankComponent } from './bank.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [BankComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ]
})
export class BankModule { }
