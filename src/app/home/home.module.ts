import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivateUserComponent } from './activate-user/activate-user.component';
import { BlankComponent } from './blank.component';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PasswordStrengthMeterModule } from 'angular-password-strength-meter';
import { IndexComponent } from './index/index.component';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { FooterComponent } from './footer/footer.component';




@NgModule({
  declarations: [HeaderComponent, ActivateUserComponent, BlankComponent,
    IndexComponent, TermsOfServiceComponent, PrivacyPolicyComponent, FooterComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NgxSpinnerModule,
    PasswordStrengthMeterModule
  ]
})
export class HomeModule { }
