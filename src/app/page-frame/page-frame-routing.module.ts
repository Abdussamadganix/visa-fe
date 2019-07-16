import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageFrameComponent } from './page-frame.component';
import { DashboardComponent } from '../dashboard/dashboard/dashboard.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpConfigInterceptor } from '../interceptor/httpconfig.interceptor';
import { PageFrameGuard } from './page-frame.guard';
import { ViewTransactionComponent } from '../transaction/view-transaction/view-transaction.component';
import { VeiwMerchantComponent } from '../merchant/veiw-merchant/veiw-merchant.component';
import { GetListOfUsersComponent } from '../user/get-list-of-users/get-list-of-users.component';
import { RoleComponent } from '../role/role.component';
import { BankComponent } from '../bank/bank.component';
import { SettingsComponent } from '../settings/settings.component';
import { StarterComponent } from '../starter/starter.component';
import { PgSetupComponent } from '../pg-setup/pg-setup.component';
import { ProviderComponent } from '../pg-setup/provider/provider.component';
import { TransManagerComponent } from '../pg-setup/trans-manager/trans-manager.component';
import { BinComponent } from '../pg-setup/bin/bin.component';
import { PermisionsGuard } from '../guard/permisions.guard';




@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      // {path: 'login', component: LoginComponent},
      // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      {
        path: '', component: PageFrameComponent,
        canActivate: [PageFrameGuard],
        children: [
          { path: 'dashboard', component: DashboardComponent },
          { path: 'starter/business-information', component: StarterComponent },
          { path: 'starter/identity-validation', component: StarterComponent },
          { path: 'starter/account-validation', component: StarterComponent },
          { path: 'starter/payment-setup', component: StarterComponent },
          {
            path: 'transaction/view', component: ViewTransactionComponent,
            canActivate: [PermisionsGuard],
            data: { expectedPermission: ['payment_index'], title: 'Home' }
          },
          {
            path: 'merchant/view', component: VeiwMerchantComponent,
            canActivate: [PermisionsGuard],
            data: { expectedPermission: ['merchant_index'] }
          },
          {
            path: 'provider', component: ProviderComponent,
            canActivate: [PermisionsGuard],
            data: { expectedPermission: ['provider_index'] }
          },
          {
            path: 'transManager', component: TransManagerComponent,
            canActivate: [PermisionsGuard],
            data: { expectedPermission: ['card_transaction_settings_index'] }
          },
          {
            path: 'bin', component: BinComponent,
            canActivate: [PermisionsGuard],
            data: { expectedPermission: ['bin_index'] }
          },
          {
            path: 'users/view', component: GetListOfUsersComponent,
            canActivate: [PermisionsGuard],
            data: { expectedPermission: ['user_index'] }
          },
          {
            path: 'roles/view', component: RoleComponent,
            canActivate: [PermisionsGuard],
            data: { expectedPermission: ['role_index'] }
          },
          { path: 'settings', component: SettingsComponent },
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
