import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageFrameComponent } from './page-frame.component';
import { DashboardComponent } from '../dashboard/dashboard/dashboard.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpConfigInterceptor } from '../interceptor/httpconfig.interceptor';
import { PageFrameGuard } from './page-frame.guard';
import { ViewTransactionComponent } from '../transaction/view-transaction/view-transaction.component';
import { PermisionsGuard } from '../guard/permisions.guard';
import { LogsComponent } from '../logs/logs.component';
import { MerchantComponent } from '../merchant/merchant.component';




@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      // {path: 'logs', component: LogsComponent},
      // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      {
        path: '', component: PageFrameComponent,
        canActivate: [PageFrameGuard],
        children: [
          { path: 'dashboard', component: DashboardComponent },
          { path: 'logs', component: LogsComponent },
          { path: 'merchant', component: MerchantComponent },
          // {
          //   path: 'transaction/view', component: ViewTransactionComponent,
          //   canActivate: [PermisionsGuard],
          //   data: { expectedPermission: ['payment_index'], title: 'Home' }
          // },
        ]
      }
    ])
  ],
  declarations: [],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpConfigInterceptor,
      multi: true
    }
  ],
  exports: [RouterModule]
})
export class PageFrameRoutingModule {
}
