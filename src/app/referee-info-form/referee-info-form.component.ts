import {Component, OnInit, Input} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Router, ActivatedRoute} from '@angular/router';

import {CustomValidators} from './../custom.validators';
import {FormService} from './../form.service';
import {CanComponentDeactivate} from './../can-deactivate-guard.service';

@Component({
  selector: 'app-referee-info-form',
  templateUrl: './referee-info-form.component.html',
  styleUrls: ['./referee-info-form.component.css']
})
export class RefereeInfoFormComponent implements OnInit, CanComponentDeactivate {

  refereeInfoForm:FormGroup;
  isSubmitClicked:boolean = false;
  @Input('summary') isSummaryMode;
  @Input('removeHeaderDetail') removeDetail;

  constructor(private formService:FormService, private router:Router,
              private route:ActivatedRoute) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    // Create form
    this.refereeInfoForm = new FormGroup({
      'onUniversity': new FormGroup({
        'id': new FormControl(null, []),
        'name': new FormControl(null, [Validators.required]),
        'designation': new FormControl(null, [Validators.required]),
        'workPlace': new FormControl(null, [Validators.required]),
        'address': new FormControl(null, [Validators.required]),
        'workPlaceEmail': new FormControl(null, [Validators.required, Validators.email]),
        'mobile': new FormControl(null, [Validators.required, CustomValidators.validatePhoneNumber]),
        'officePhone': new FormControl(null, [Validators.required, CustomValidators.validatePhoneNumber])
      }),
      'onEmployment': new FormGroup({
        'id': new FormControl(null, []),
        'name': new FormControl(null, [Validators.required]),
        'designation': new FormControl(null, [Validators.required]),
        'workPlace': new FormControl(null, [Validators.required]),
        'address': new FormControl(null, [Validators.required]),
        'workPlaceEmail': new FormControl(null, [Validators.required, Validators.email]),
        'mobile': new FormControl(null, [Validators.required, CustomValidators.validatePhoneNumber]),
        'officePhone': new FormControl(null, [Validators.required, CustomValidators.validatePhoneNumber])
      })
    });

    // Set model data into form
    this.refereeInfoForm.patchValue({
      'onUniversity': {
        'id': this.formService.refereeInfo.onUniversity.id,
        'name': this.formService.refereeInfo.onUniversity.name,
        'designation': this.formService.refereeInfo.onUniversity.designation,
        'workPlace': this.formService.refereeInfo.onUniversity.workPlace,
        'address': this.formService.refereeInfo.onUniversity.address,
        'workPlaceEmail': this.formService.refereeInfo.onUniversity.workPlaceEmail,
        'mobile': this.formService.refereeInfo.onUniversity.mobile,
        'officePhone': this.formService.refereeInfo.onUniversity.officePhone
      },
      'onEmployment': {
        'id': this.formService.refereeInfo.onEmployment.id,
        'name': this.formService.refereeInfo.onEmployment.name,
        'designation': this.formService.refereeInfo.onEmployment.designation,
        'workPlace': this.formService.refereeInfo.onEmployment.workPlace,
        'address': this.formService.refereeInfo.onEmployment.address,
        'workPlaceEmail': this.formService.refereeInfo.onEmployment.workPlaceEmail,
        'mobile': this.formService.refereeInfo.onEmployment.mobile,
        'officePhone': this.formService.refereeInfo.onEmployment.officePhone,
        'type': 'work'
      }
    });

    if (this.isSummaryMode) {
      this.refereeInfoForm.disable()
    }
  }

  onSubmit() {
    this.isSubmitClicked = true;

    if (this.refereeInfoForm.valid) {

      this.formService.addRefereeInfo(this.refereeInfoForm.value);

      let observable
      if (this.formService.isUserRegistered()) {
        observable = this.formService.updateFormData();
      } else {
        observable = this.formService.submitFormData();
      }

      if (observable) {
        observable.subscribe((res:Response) => {
          this.isSubmitClicked = false;
          this.formService.setUserRegistered()
          this.formService.loadUserData(res)
          this.router.navigate(['../summary'], {relativeTo: this.route});
        });
      } else {
        alert("It seems you have missed some manditory fields in the form.")
      }
    }
  }

  onBack() {
    this.router.navigate(['../job'], {relativeTo: this.route});
  }

  canDeactivate(nextState):Observable<boolean> | Promise<boolean> | boolean {
    if (this.formService.isNextStateFormComplete(nextState.url)) {
      return true;
    } else if (this.refereeInfoForm.valid) {
      this.formService.addRefereeInfo(this.refereeInfoForm.value)
      return true;
    } else {
      return false;
    }
  }
}
