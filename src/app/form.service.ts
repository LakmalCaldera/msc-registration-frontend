import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions, ResponseContentType} from '@angular/http';
import 'rxjs/add/operator/map'
import * as moment from 'moment';
import { PaymentService } from './payment.service';
import {LoginInfo, GeneralInfo, EducationInfo, JobInfo, RefereeInfo, RegistrationResponse} from './interfaces';

@Injectable()
export class FormService {

  // Form information models
  generalInfo:GeneralInfo;
  educationInfo:EducationInfo;
  jobInfo:JobInfo;
  refereeInfo:RefereeInfo;
  studentHash: String;
  studentIndexNo: number;
  isDeffered: boolean;

  // Does student have an actual account
  _isUserRegistered:boolean = false;

  // Has the student verified all online information and ready for payment
  _isStudentConfirmed:boolean = false;

  constructor(private http:Http, private paymentService: PaymentService) {
    this.initFormData()
  }

  // Initialize form data with default values
  initFormData() {
    this.generalInfo = {
      firstProgram: null,
      secondProgram: null,
      thirdProgram: null,
      title: null,
      fullName: null,
      gender: null,
      dob: null,
      email: null,
      nic: null,
      mobileno: null,
      homeno: null,
      address: null,
      name_with_initial: null
    };
    this.educationInfo = {
      degrees: [{
        id: null,
        degTitle: null,
        uni: null,
        yoa: null,
        gpa: null,
        dateEntered: null,
        dateLeft: null
      }], otherQualifications: []
    }
    this.jobInfo = {
      designation: null,
      workPlace: null,
      officeAddress: null,
      workPlaceEmail: null,
      officeMobile: null,
      officePhone: null,
      jobDesc: null,
      addrStatus: null,
      workPlaces: []
    };
    this.refereeInfo = {
      onUniversity: {
        id: null,
        name: null,
        designation: null,
        workPlace: null,
        address: null,
        workPlaceEmail: null,
        mobile: null,
        officePhone: null,
        type: null
      },
      onEmployment: {
        id: null,
        name: null,
        designation: null,
        workPlace: null,
        address: null,
        workPlaceEmail: null,
        mobile: null,
        officePhone: null,
        type: null
      },
      allInfoVerified: false
    };
  }

  resetForm() {
    let nic = this.generalInfo.nic;
    this.initFormData();
    this.generalInfo.nic = nic;
  }

  addGeneralInfo(info:GeneralInfo) {
    console.log(`info.dob -> ${info.dob}`);
    console.log(`info.dob after moment -> ${moment(info.dob)}`)
    this.generalInfo = info;
  }

  addEducationInfo(info:EducationInfo) {
    this.educationInfo = info;
  }

  addJobInfo(info:JobInfo) {
    this.jobInfo = info;
  }

  addRefereeInfo(info:RefereeInfo) {
    info.onUniversity.type = 'academic'
    info.onEmployment.type = 'work'
    this.refereeInfo = info;
  }

  addLoginInfo(info:LoginInfo) {
    this.generalInfo.nic = info.nic;
  }

  isGeneralFormComplete() {
    for (var key in this.generalInfo) {
      if (key != "secondProgram" && key != "thirdProgram" && !this.generalInfo[key]){
        console.log(`key: ${key}, value: ${this.generalInfo[key]}`)
        return false
      }
    }
    return true
  }

  isEducationFormCompelete() {
    let degrees = this.educationInfo.degrees;
    if (degrees.length == 0) {
      return false
    }
    for (var key in degrees) {
      if (!degrees[key])
        return false
    }
    return true
  }

  isJobFormCompelete() {
    for (var key in this.jobInfo) {
      if (!this.jobInfo[key])
        return false
    }
    return true
  }

  isRefereeFormCompelete() {
    for (var key in this.refereeInfo.onUniversity) {
      if (key != 'id' && !this.refereeInfo.onUniversity[key])
        return false
    }
    for (var key in this.refereeInfo.onEmployment) {
      if (key != 'id' && !this.refereeInfo.onEmployment[key])
        return false
    }
    return true
  }

  isNextStateFormComplete(url:string):boolean {
    if (url == '/' || url == '/general') {
      return this.isGeneralFormComplete()
    } else if (url == '/education') {
      return this.isEducationFormCompelete()
    } else if (url == '/job') {
      return this.isJobFormCompelete();
    } else if (url == '/referee') {
      return this.isRefereeFormCompelete();
    } else {
      return true;
    }
  }

  getFormData(nic:string, capChaToken:string) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});

    return this.http.post(`/registration/${nic}`, {
      "g-recaptcha-response": capChaToken
    }, options).map((res:Response) => res.json())
  }

  isUserRegistered():boolean {
    return this._isUserRegistered
  }

  resetRegisteredUser() {
    this._isUserRegistered = false
  }

  setUserRegistered() {
    this._isUserRegistered = true
  }

  isStudentNicAvailable() {
    if (this.generalInfo.nic) {
      return true
    } else {
      return false
    }
  }

  updateFormData() {
    if (this.isGeneralFormComplete() &&
      this.isEducationFormCompelete() &&
      this.isJobFormCompelete() &&
      this.isRefereeFormCompelete()) {

      let headers = new Headers({'Content-Type': 'application/json'});
      let options = new RequestOptions({headers: headers});

      return this.http.patch(`/registration/${this.generalInfo.nic}`, {
        generalInfo: this.generalInfo,
        educationInfo: this.educationInfo,
        jobInfo: this.jobInfo,
        refereeInfo: this.refereeInfo
      }, options).map((res:Response) => res.json())
    }
  }

  submitFormData() {
    console.log(`this.isGeneralFormComplete() -> ${this.isGeneralFormComplete()}`);
    console.log(`this.isEducationFormCompelete() -> ${this.isEducationFormCompelete()}`);
    console.log(`this.isJobFormCompelete() -> ${this.isJobFormCompelete()}`);
    console.log(`this.isRefereeFormCompelete() -> ${this.isRefereeFormCompelete()}`);
    if (this.isGeneralFormComplete() &&
      this.isEducationFormCompelete() &&
      this.isJobFormCompelete() &&
      this.isRefereeFormCompelete()) {
      let headers = new Headers({'Content-Type': 'application/json'});
      let options = new RequestOptions({headers: headers});
      return this.http.post(`/registration`, {
        generalInfo: this.generalInfo,
        educationInfo: this.educationInfo,
        jobInfo: this.jobInfo,
        refereeInfo: this.refereeInfo
      }, options).map((res:Response) => res.json())
    }
  }

  confirmStudent() {
    if (this.isGeneralFormComplete() &&
      this.isEducationFormCompelete() &&
      this.isJobFormCompelete() &&
      this.isRefereeFormCompelete()) {
      let headers = new Headers({'Content-Type': 'application/json'});
      let options = new RequestOptions({headers: headers});
      return this.http.post(`/registration/${this.generalInfo.nic}/confirm`, options).map((res:Response) => res.json())
    }
  }

  getStudentIndexNo(){
    return this.studentIndexNo
  }

  isStudentDeffered(){
    return this.isDeffered
  }

  isStudentConfirmed() {
    return this._isStudentConfirmed
  }

  getStudentHash(){
    return this.studentHash;
  }

  setStudentHash(hash){
    this.studentHash = hash;
  }

  loadUserData(response:Response) {
    let data = response as Object as RegistrationResponse
    // Loading General Info
    this.generalInfo.firstProgram = data.student_master.first_degree_preference;
    this.generalInfo.secondProgram = data.student_master.second_degree_preference;
    this.generalInfo.thirdProgram = data.student_master.third_degree_preference;
    this.generalInfo.title = data.title;
    this.generalInfo.name_with_initial = data.name_with_initial;
    this.generalInfo.fullName = data.full_name;
    this.generalInfo.gender = data.gender;
    this.generalInfo.dob = moment(data.dob).format('YYYY-MM-DD').toString();
    this.generalInfo.email = data.email;
    this.generalInfo.nic = data.national_id_or_passport;
    this.generalInfo.mobileno = data.mobile_no;
    this.generalInfo.homeno = data.home_no;
    this.generalInfo.address = data.personal_address;
    this._isStudentConfirmed = data.confirmed;
    this.studentIndexNo = data.application_id
    this.isDeffered = data.deffered;

    this.setStudentHash(data.hash);
    this.paymentService.setPaymentInfo(data.student_master.payment_transaction_id, data.student_master.payment_amount, data.student_master.registration_payment_date, data.student_master.registration_payment_status);

    // Loading Eductional Info Degrees
    this.educationInfo.degrees = data.student_education.map((education) => {
      return {
        id: education.id,
        degTitle: education.degree_title,
        uni: education.university,
        yoa: education.year_of_award,
        gpa: education.class_or_gpa,
        dateEntered: moment(education.date_entered).format('YYYY-MM-DD').toString(),
        dateLeft: moment(education.date_left).format('YYYY-MM-DD').toString()
      }
    });

    // Loading Eductional Info Other Qualifications
    this.educationInfo.otherQualifications = data.student_other_qualification.map((qualification) => {
      return {
        id: qualification.id,
        otherQTitle: qualification.qualif_or_cert,
        orgTitle: qualification.inst_or_org,
        doa: moment(qualification.date_of_award).format('YYYY-MM-DD').toString(),
        duration: qualification.duration
      }
    });

    // Loading JobInfo current working place
    this.jobInfo.designation = data.student_current_employment.designation;
    this.jobInfo.workPlace = data.student_current_employment.organization;
    this.jobInfo.officeAddress = data.student_current_employment.address;
    this.jobInfo.workPlaceEmail = data.student_current_employment.email;
    this.jobInfo.officeMobile = data.student_current_employment.office_mobile;
    this.jobInfo.officePhone = data.student_current_employment.office_phone;
    this.jobInfo.jobDesc = data.student_current_employment.job_description;
    this.jobInfo.addrStatus = data.student_current_employment.correspondent_address;


    // Loading Eductional Info Other Qualifications
    this.jobInfo.workPlaces = data.student_employment_record.map((employment) => {
      return {
        id: employment.id,
        designation: employment.designation,
        workPlaceOrEmployer: employment.workp_or_emp,
        frmDate: moment(employment.from_date).format('YYYY-MM-DD').toString(),
        toDate: moment(employment.end_date).format('YYYY-MM-DD').toString()
      }
    });

    // Loading Eductional Info Other Qualifications
    let academicReferees = data.student_referee.filter((referee) => {
      return referee.type.toLowerCase() == 'academic'
    }).map((referee) => {
      return {
        id: referee.id,
        name: referee.name,
        designation: referee.designation,
        workPlace: referee.organization,
        address: referee.address,
        workPlaceEmail: referee.organization_email,
        mobile: referee.mobile,
        officePhone: referee.phone,
        type: referee.type
      }
    });

    let workReferees = data.student_referee.filter((referee) => {
      return referee.type.toLowerCase() == 'work'
    }).map((referee) => {
      return {
        id: referee.id,
        name: referee.name,
        designation: referee.designation,
        workPlace: referee.organization,
        address: referee.address,
        workPlaceEmail: referee.organization_email,
        mobile: referee.mobile,
        officePhone: referee.phone,
        type: referee.type
      }
    });

    this.refereeInfo.onUniversity = academicReferees.length > 0 && academicReferees[0];
    this.refereeInfo.onEmployment = workReferees.length > 0 && workReferees[0];


    console.log(this.generalInfo);
    console.log(this.educationInfo);
    console.log(this.jobInfo);
    console.log(this.refereeInfo);

  }

  getFormDataFromHash(hash: string) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});

    return this.http.get(`/registration/${hash}/info`, options).map((res:Response) => res.json())
  }

  downloadAdmissionCard() {
    let headers = new Headers({'Content-Type': 'application/pdf', 'Content-Disposition': 'inline; filename=admission_card.pdf'});
    let options = new RequestOptions({headers: headers});

    return this.http.get(`/registration/admission?nic=${this.generalInfo.nic}`, { responseType: ResponseContentType.Blob }).map((res:Response) => res.json())
  }
}
