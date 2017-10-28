import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map'
import * as moment from 'moment';
import {LoginInfo, GeneralInfo, EducationInfo, JobInfo, RefereeInfo, RegistrationResponse} from './interfaces';

@Injectable()
export class PaymentService {

  payment_transaction_id:number;
  payment_amount:number
  registration_payment_date:number;
  registration_payment_status:string;

  setPaymentInfo(transId, payAmount, timestamp, status) {
    this.payment_transaction_id = transId;
    this.payment_amount = payAmount;
    this.registration_payment_date = timestamp;
    this.registration_payment_status = status;
  }

  getPaymentInfo() {
    return {
      payment_transaction_id: this.payment_transaction_id,
      payment_amount: this.payment_amount,
      registration_payment_date: this.registration_payment_date,
      registration_payment_status: this.registration_payment_status
    }
  }

  isStudentPaymentComplete() {
        if (this.registration_payment_status && this.registration_payment_status.toLowerCase() == "full") {
          return true
    } else {
        return false
    }
  }

  isStudentPaymentInformationComplete(){
    return  this.isStudentPaymentComplete() && this.payment_transaction_id && this.payment_amount && this.registration_payment_date && this.registration_payment_status ? true : false
  }

}
