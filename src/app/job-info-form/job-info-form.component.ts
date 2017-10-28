import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute, RouterStateSnapshot } from '@angular/router';

import { CustomValidators } from './../custom.validators';
import { FormService } from './../form.service';
import { CanComponentDeactivate } from './../can-deactivate-guard.service';

@Component({
  selector: 'app-job-info-form',
  templateUrl: './job-info-form.component.html',
  styleUrls: ['./job-info-form.component.css']
})
export class JobInfoFormComponent implements OnInit, CanComponentDeactivate {

  jobInfoForm: FormGroup;
  isSubmitClicked: boolean = false;
  @Input('summary') isSummaryMode;
  @Input('removeHeaderDetail') removeDetail;

  addrStatuses = [{value: 'NONE', text: 'Choose...'}, 
                    {value: 'OFFICE', text: 'OFFICE'}, 
                    {value: 'PERMANENT', text: 'PERMANENT'}]

  constructor(private formService: FormService, private router: Router,
              private route: ActivatedRoute, private formBuilder: FormBuilder) {}

  ngOnInit() {
    window.scrollTo(0, 0);
    
    // Create form Controls
    let workPlacesFormArray = this.formService.jobInfo.workPlaces.map(() => {
        return this.initWorkplace()
    });

    // Create Form
    this.jobInfoForm = this.formBuilder.group({
            designation: new FormControl(null, [Validators.required]),
            workPlace: new FormControl(null, [Validators.required]),
            officeAddress: new FormControl(null, [Validators.required]),
            workPlaceEmail: new FormControl(null, [Validators.required, Validators.email]),
            officeMobile: new FormControl(null, [Validators.required, CustomValidators.validatePhoneNumber]),
            officePhone: new FormControl(null, [Validators.required, CustomValidators.validatePhoneNumber]),
            jobDesc: new FormControl(null, [Validators.required]),
            addrStatus: new FormControl(null, [Validators.required, CustomValidators.selectionRequired]),
            workPlaces: this.formBuilder.array(workPlacesFormArray)
        });

    // Set model data into form
    this.jobInfoForm.setValue({
        'designation': this.formService.jobInfo.designation,
        'workPlace': this.formService.jobInfo.workPlace,
        'officeAddress': this.formService.jobInfo.officeAddress,
        'workPlaceEmail': this.formService.jobInfo.workPlaceEmail,
        'officeMobile': this.formService.jobInfo.officeMobile,
        'officePhone': this.formService.jobInfo.officePhone,
        'jobDesc': this.formService.jobInfo.jobDesc,
        'addrStatus': this.formService.jobInfo.addrStatus ? this.getAddressStatus(this.formService.jobInfo.addrStatus) : this.addrStatuses[0].value,
        'workPlaces': this.formService.jobInfo.workPlaces
    });

    if(this.isSummaryMode) {
      this.jobInfoForm.disable()
    }
  }

  getAddressStatus(val): string {
    switch (val) {
      case "0":
        return 'OFFICE'
      case "1":
        return 'PERMANENT'
      default:
        return val
    }
  }

  initWorkplace() {
        return this.formBuilder.group({
            id: [''],
            designation: ['', Validators.required],
            workPlaceOrEmployer: ['', Validators.required],
            frmDate: ['', Validators.required],
            toDate: ['', Validators.required]
        });
    }

    addWorkplace() {
        const control = <FormArray>this.jobInfoForm.controls['workPlaces'];
        control.push(this.initWorkplace());
    }

    removeWorkplace(i: number) {
        const control = <FormArray>this.jobInfoForm.controls['workPlaces'];
        control.removeAt(i);
    }

  onSubmit() {
      this.isSubmitClicked = true;
    if(this.jobInfoForm.valid){
    console.log(this.jobInfoForm.value);
    this.formService.addJobInfo(this.jobInfoForm.value)
    this.router.navigate(['../referee'], {relativeTo: this.route});
    }
  }

  onBack(){
    this.router.navigate(['../education'], {relativeTo: this.route});
  }

  canDeactivate(nextState: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.formService.isNextStateFormComplete(nextState.url)){
        return true;
    } else if (this.jobInfoForm.valid){
        this.formService.addJobInfo(this.jobInfoForm.value)
        return true;
    } else {
        return false;
    }
  }
}
