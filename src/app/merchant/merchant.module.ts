import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { VeiwMerchantComponent } from './veiw-merchant/veiw-merchant.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxPaginationModule } from 'ngx-pagination';
// import { WavesModule, SelectModule } from 'ng-uikit-pro-standard';

@NgModule({
  declarations: [VeiwMerchantComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    PdfViewerModule,
    NgxPaginationModule
  ]
})
export class MerchantModule { }
