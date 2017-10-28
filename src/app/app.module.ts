import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RecaptchaModule } from 'ng-recaptcha';
import { HttpModule }    from '@angular/http';

import { AppComponent } from './app.component';
import { GeneralInfoFormComponent } from './general-info-form/general-info-form.component';
import { EducationInfoFormComponent } from './education-info-form/education-info-form.component';
import { JobInfoFormComponent } from './job-info-form/job-info-form.component';
import { RefereeInfoFormComponent } from './referee-info-form/referee-info-form.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthLoginGuard } from './auth-guard-login-validation.service';
import { AuthSummaryGuard } from './auth-guard-summary-validation.service';
import { AuthSystemOpenGuard } from './auth-guard-system-open-validation.service';
import { FormService } from './form.service';
import { ConfigService } from './systemconfig.service';
import { CanDeactivateGuard } from './can-deactivate-guard.service';
import { CommonHeaderComponent } from './shared/common-header/common-header.component';
import { LoginInfoFormComponent } from './login-info-form/login-info-form.component';
import { RegistrationSuccessMessageComponent } from './registration-success-message/registration-success-message.component';
import { SummaryInfoComponent } from './summary-info/summary-info.component';
import { NavigationBarComponent } from './shared/navigation-bar/navigation-bar.component';
import { StudentInstructionComponent } from './student-instruction/student-instruction.component';
import { NotFoundErrorComponent } from './not-found-error/not-found-error.component';
import { RequestErrorComponent } from './request-error/request-error.component';
import { PaymentGatewayFormComponent } from './payment-gateway-form/payment-gateway-form.component';
import { RegistrationsClosedComponent } from './registrations-closed/registrations-closed.component';
import { PaymentConfirmationFormComponent } from './payment-confirmation-form/payment-confirmation-form.component';
import { PaymentService } from './payment.service';




@NgModule({
  declarations: [
    AppComponent,
    GeneralInfoFormComponent,
    EducationInfoFormComponent,
    JobInfoFormComponent,
    RefereeInfoFormComponent,
    CommonHeaderComponent,
    LoginInfoFormComponent,
    RegistrationSuccessMessageComponent,
    SummaryInfoComponent,
    NavigationBarComponent,
    StudentInstructionComponent,
    NotFoundErrorComponent,
    RequestErrorComponent,
    PaymentGatewayFormComponent,
    RegistrationsClosedComponent,
    PaymentConfirmationFormComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    RecaptchaModule.forRoot(),
    HttpModule
  ],
  providers: [ConfigService, AuthLoginGuard, AuthSummaryGuard, FormService, PaymentService, CanDeactivateGuard, AuthSystemOpenGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
