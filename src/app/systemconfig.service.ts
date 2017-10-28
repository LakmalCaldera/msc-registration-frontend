import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map'
import * as moment from 'moment';
import {
  LoginInfo,
  GeneralInfo,
  EducationInfo,
  JobInfo,
  RefereeInfo,
  RegistrationResponse,
  SystemConfigResponse
} from './interfaces';

@Injectable()
export class ConfigService {

  private openingTimestamp:string;
  private closingTimestamp:string;
  private paymentRedirectUrl:string;
  private _isSystemConfigSet:boolean = false;

  constructor(private http:Http) {
  }

  setSystemConfiguration(response:Response) {
    let data = response as Object as SystemConfigResponse;
    this.openingTimestamp = data['registration_open_from'];
    this.closingTimestamp = data['registration_open_to'];
    this.paymentRedirectUrl = data['payment_redirect_url'];
    this._isSystemConfigSet = true;
  }

  getPGWUrl() {
    return this.paymentRedirectUrl;
  }

  isSystemConfigSet() {
    return this._isSystemConfigSet
  }

  // Initialize form data with default values
  getConfigInformation() {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});

    return this.http.get(`/config`, options).map((res:Response) => res.json());
  }

  isSystemOpenAtThisMoment() {
    console.log(`openingTimestamp - ${this.openingTimestamp}, closingTimestamp - ${this.closingTimestamp}, moment().unix() - ${moment().unix()}`);
    const now = moment().unix()
    return (moment(this.openingTimestamp, 'DD/MM/YYYY').unix()) <= now && now < (moment(this.closingTimestamp, 'DD/MM/YYYY').unix())
  }
}
