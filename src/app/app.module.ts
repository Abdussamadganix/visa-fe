import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { PageFrameComponent } from './page-frame/page-frame.component';
import { PageFrameRoutingModule } from './page-frame/page-frame-routing.module';
import { HomeModule } from './home/home.module';
import { RegisterComponent } from './home/register/register.component';
import { LoginComponent } from './home/login/login.component';
import { ForgotPasswordComponent } from './home/forgot-password/forgot-password.component';
import { DataTablesModule } from 'angular-datatables';
import { TransactionModule } from './transaction/transaction.module';
import { MerchantModule } from './merchant/merchant.module';
import { UserModule } from './user/user.module';
import { RegisterInputDirective } from './validation/register-input.directive';
import { RoleModule } from './role/role.module';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BankModule } from './bank/bank.module';
import { SettingsModule } from './settings/settings.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ng6-toastr-notifications';
import { PasswordStrengthDirective } from './directives/password-strength.directive';
import { PasswordStrengthMeterModule } from 'angular-password-strength-meter';
import { DashboardModule } from './dashboard/dashboard.module';
import { StarterModule } from './starter/starter.module';
import { PgSetupModule } from './pg-setup/pg-setup.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';

// import { PasswordStrengthMeterModule } from '../../projects/password-strength-meter/src/lib/password-strength-meter.module';
@NgModule({
  declarations: [
    AppComponent,
    PageFrameComponent,
    RegisterComponent,
    LoginComponent,
    ForgotPasswordComponent,
    RegisterInputDirective,
    PasswordStrengthDirective,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    RouterModule,
    PageFrameRoutingModule,
    ReactiveFormsModule,
    HomeModule,
    DataTablesModule,
    TransactionModule,
    MerchantModule,
    UserModule,
    RoleModule,
    BankModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    SettingsModule,
    PasswordStrengthMeterModule,
    DashboardModule,
    StarterModule,
    PgSetupModule,
    PdfViewerModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [AppRoutingModule],
})
export class AppModule { }
