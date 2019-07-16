import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from 'angular-6-datatable';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PgSetupComponent } from './pg-setup.component';
import { ProviderComponent } from './provider/provider.component';
import { TransManagerComponent } from './trans-manager/trans-manager.component';
import { BinComponent } from './bin/bin.component';

@NgModule({
  declarations: [PgSetupComponent, ProviderComponent, TransManagerComponent, BinComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DataTableModule,
    NgxSpinnerModule,
  ]
})
export class PgSetupModule { }
