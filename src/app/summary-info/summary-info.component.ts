import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Location} from '@angular/common';
import {FormArray, FormControl, FormGroup, Validators, FormBuilder} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {Router, ActivatedRoute, RouterStateSnapshot, Params} from '@angular/router';
import * as jsPDF from 'jspdf';
import {LoginInfo, GeneralInfo, EducationInfo, JobInfo, RefereeInfo, RegistrationResponse} from './../interfaces';
import * as moment from 'moment';
import 'rxjs/Rx' ;

import {CustomValidators} from './../custom.validators';
import {FormService} from './../form.service';
import {PaymentService} from './../payment.service';

@Component({
  selector: 'app-summary-info',
  templateUrl: './summary-info.component.html',
  styleUrls: ['./summary-info.component.css']
})
export class SummaryInfoComponent implements OnInit {

  summaryForm:FormGroup;
  year:string;
  isStudentConfirmed:boolean;
  isStudentPaymentComplete:boolean;
  summaryTitle:string;
  isStudentPaymentInformationComplete: boolean;

  isSubmitClicked:boolean = false;
  transId;
  transAmount;
  transDate;
  isDataLoaded:boolean = true;

  constructor(private paymentService:PaymentService, private http:Http, private formService:FormService, private router:Router,
              private route:ActivatedRoute, private formBuilder:FormBuilder) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    // Create Form
    this.summaryForm = this.formBuilder.group({
      'allInfoVerified': new FormControl(null, [Validators.required, CustomValidators.validateCheckbox])
    });
    this.loadData();
  }

  loadDataIntoSummary() {
    this.year = `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`;
    this.isStudentConfirmed = this.formService.isStudentConfirmed();
    this.isStudentPaymentComplete = this.paymentService.isStudentPaymentComplete();
    this.isStudentPaymentInformationComplete = this.paymentService.isStudentPaymentInformationComplete();
    this.transId = this.paymentService.getPaymentInfo().payment_transaction_id;
    this.transDate = moment.unix(this.paymentService.getPaymentInfo().registration_payment_date).format("DD/MM/YYYY");
    this.transAmount = this.paymentService.getPaymentInfo().payment_amount;

    // // Set model data into form
    if (this.isStudentConfirmed) {
      this.summaryForm.setValue({
        'allInfoVerified': true
      });
      this.summaryForm.get('allInfoVerified').disable()
      this.summaryTitle = "The following are your details.";
    } else {
      this.summaryForm.setValue({
        'allInfoVerified': false
      });
      this.summaryForm.get('allInfoVerified').enable()
      this.summaryTitle = "The following are your details. Please confirm below.";
    }
  }

  loadData() {
    if (!this.formService.isGeneralFormComplete() || !this.formService.isEducationFormCompelete() || !this.formService.isJobFormCompelete() || !this.formService.isRefereeFormCompelete()) {
      this.formService.setUserRegistered()
      this.route.queryParams.subscribe((params:Params) => {
        let secret = params['secret'];
        if (secret) {
          this.isDataLoaded = false;
          this.formService.getFormDataFromHash(secret).subscribe((res:Response) => {
            if (res != null) {
              this.formService.loadUserData(res)
              this.formService.setUserRegistered()
              this.loadDataIntoSummary()
            } else {
              this.formService.resetRegisteredUser()
            }
            this.isDataLoaded = true;
          }, (res:Response) => {
            this.router.navigate(['../request-error'], {relativeTo: this.route});
          });
        } else {
          this.loadDataIntoSummary()
        }
      });
    } else {
      this.loadDataIntoSummary()
    }
  }

  onBack() {
    this.router.navigate(['../referee'], {relativeTo: this.route});
  }

  onPrint() {
    window.print()
  }

  onSubmit() {
    let observable = this.formService.confirmStudent();
    this.isSubmitClicked = true;

    if (observable) {
      observable.subscribe((res:Response) => {
        let data = res as Object as RegistrationResponse
        console.log(data)
        this.formService.loadUserData(res)
        this.formService.setStudentHash(data.hash);
        if (!this.paymentService.isStudentPaymentComplete()){
          this.onPayment();
        } else {
          this.loadDataIntoSummary()
        }
      });
    }
  }

  onPayment() {
    this.router.navigate(['../payment-confirmation'], {relativeTo: this.route});
  }

  onInstructions() {
    this.router.navigate(['../instruction'], {relativeTo: this.route});
  }

  onStatus() {
    this.router.navigate(['../registration-success'], {relativeTo: this.route});
  }

  isMCSSelected() {
    return this.formService.generalInfo.firstProgram == "MCS" ||
      this.formService.generalInfo.secondProgram == "MCS" ||
      this.formService.generalInfo.thirdProgram == "MCS"
  }

  isMITSelected() {
    return this.formService.generalInfo.firstProgram == "MIT" ||
      this.formService.generalInfo.secondProgram == "MIT" ||
      this.formService.generalInfo.thirdProgram == "MIT"
  }

  isMISSelected() {
    return this.formService.generalInfo.firstProgram == "MIS" ||
      this.formService.generalInfo.secondProgram == "MIS" ||
      this.formService.generalInfo.thirdProgram == "MIS"
  }
}

