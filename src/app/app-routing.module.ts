import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from 'src/app/home/login/login.component';
import { RegisterComponent } from 'src/app/home/register/register.component';
import { ForgotPasswordComponent } from './home/forgot-password/forgot-password.component';
import { ActivateUserComponent } from './home/activate-user/activate-user.component';
import { BlankComponent } from './home/blank.component';
import { HomeGuard } from './home/home.guard';
import { IndexComponent } from './home/index/index.component';
import { PrivacyPolicyComponent } from './home/privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from './home/terms-of-service/terms-of-service.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: 'activate-email/:activationCode', component: ActivateUserComponent },
      { path: 'set-password/:activationCode', component: ActivateUserComponent },
      { path: 'forgotPassword/:activationCode', component: ForgotPasswordComponent },
      { path: 'password-reset/:activationCode', component: ActivateUserComponent },
      { path: 'terms-of-service', component: TermsOfServiceComponent },
      { path: 'privacy-policy', component: PrivacyPolicyComponent },
      { path: '',  redirectTo: '/dashboard', pathMatch: 'full' },
      {path: '', component: BlankComponent, canActivate: [HomeGuard],
      children: [
        { path: 'login', component: LoginComponent },
        { path: 'register', component: RegisterComponent },
        { path: 'forgotPassword', component: ForgotPasswordComponent },
        { path: 'home', component: IndexComponent },
        // { path: 'activate-email', component: ActivateUserComponent },
        { path: 'set-password', component: ActivateUserComponent },
        { path: '**', redirectTo: '/dashboard' }
      ]},

    ])],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
