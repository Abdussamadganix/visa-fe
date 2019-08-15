import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MerchantComponent } from './merchant.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [MerchantComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSpinnerModule
  ]
})
export class MerchantModule { }
