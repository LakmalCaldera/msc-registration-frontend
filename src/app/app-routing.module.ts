import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginInfoFormComponent } from './login-info-form/login-info-form.component';
import { StudentInstructionComponent } from './student-instruction/student-instruction.component'
import { GeneralInfoFormComponent } from './general-info-form/general-info-form.component';
import { EducationInfoFormComponent } from './education-info-form/education-info-form.component';
import { JobInfoFormComponent } from './job-info-form/job-info-form.component';
import { RefereeInfoFormComponent } from './referee-info-form/referee-info-form.component';
import { RegistrationSuccessMessageComponent } from './registration-success-message/registration-success-message.component';
import { SummaryInfoComponent } from './summary-info/summary-info.component';
import { NotFoundErrorComponent } from './not-found-error/not-found-error.component';
import { RequestErrorComponent } from './request-error/request-error.component';
import { CanDeactivateGuard } from './can-deactivate-guard.service';
import { AuthLoginGuard } from './auth-guard-login-validation.service';
import { AuthSummaryGuard } from './auth-guard-summary-validation.service';
import { PaymentGatewayFormComponent } from './payment-gateway-form/payment-gateway-form.component';
import { RegistrationsClosedComponent } from './registrations-closed/registrations-closed.component';
import { AuthSystemOpenGuard } from './auth-guard-system-open-validation.service';
import { PaymentConfirmationFormComponent } from './payment-confirmation-form/payment-confirmation-form.component';

const appRoutes: Routes = [
  { path: 'payment-confirmation', component: PaymentConfirmationFormComponent, canActivate: [AuthSystemOpenGuard] },
  { path: 'registration-success', component: RegistrationSuccessMessageComponent, canActivate: [AuthSystemOpenGuard]},
  { path: 'registration-closed', component: RegistrationsClosedComponent},
  { path: '', component: LoginInfoFormComponent, canActivate: [AuthSummaryGuard, AuthSystemOpenGuard]},
  { path: 'login', component: LoginInfoFormComponent, canActivate: [AuthSummaryGuard, AuthSystemOpenGuard]},
  { path: 'instruction', component: StudentInstructionComponent, canActivate: [AuthLoginGuard, AuthSystemOpenGuard]},
  { path: 'general', component: GeneralInfoFormComponent, canActivate: [AuthLoginGuard, AuthSummaryGuard, AuthSystemOpenGuard]},
  { path: 'education', component: EducationInfoFormComponent, canActivate: [AuthLoginGuard, AuthSummaryGuard, AuthSystemOpenGuard]},
  { path: 'job', component: JobInfoFormComponent, canActivate: [AuthLoginGuard, AuthSummaryGuard, AuthSystemOpenGuard]},
  { path: 'referee', component: RefereeInfoFormComponent, canActivate: [AuthLoginGuard, AuthSummaryGuard, AuthSystemOpenGuard]},
  { path: 'summary', component: SummaryInfoComponent, canActivate: [AuthSystemOpenGuard]},
  { path: 'payment-gw', component: PaymentGatewayFormComponent, canActivate: [AuthSystemOpenGuard]},
  { path: 'request-error', component: RequestErrorComponent, canActivate: [AuthSystemOpenGuard]},
  { path: 'not-found', component: NotFoundErrorComponent, data: {message: 'Page not found!'} },
  { path: '**', redirectTo: '/not-found' }
];

@NgModule({
  imports: [
    //RouterModule.forRoot(appRoutes, {useHash: true})
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})

export class AppRoutingModule {

}
