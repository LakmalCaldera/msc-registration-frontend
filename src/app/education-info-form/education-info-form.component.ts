import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute, RouterStateSnapshot } from '@angular/router';

import { CustomValidators } from './../custom.validators';
import { FormService } from './../form.service';
import { CanComponentDeactivate } from './../can-deactivate-guard.service';

@Component({
  selector: 'app-education-info-form',
  templateUrl: './education-info-form.component.html',
  styleUrls: ['./education-info-form.component.css']
})
export class EducationInfoFormComponent implements OnInit, CanComponentDeactivate {

  educationInfoForm: FormGroup;
  isSubmitClicked: boolean = false;
  @Input('summary') isSummaryMode;
  @Input('removeHeaderDetail') removeDetail;

  constructor(private formService: FormService, private router: Router,
              private route: ActivatedRoute, private formBuilder: FormBuilder) {}


  ngOnInit() {
    window.scrollTo(0, 0);

    // Create form Controls
    let degreeFormArray = this.formService.educationInfo.degrees.length == 0 ? [this.initDegree()] :this.formService.educationInfo.degrees.map(() => {
        return this.initDegree()
    });
    let otherQualificationsFormArray = this.formService.educationInfo.otherQualifications.map(() => {
        return this.initOtherQualification()
    });

    // Create Form
    this.educationInfoForm = this.formBuilder.group({
            degrees: this.formBuilder.array(degreeFormArray),
            otherQualifications: this.formBuilder.array(otherQualificationsFormArray)
        });

    // Set model data into form
    this.educationInfoForm.setValue({
        'degrees': this.formService.educationInfo.degrees,
        'otherQualifications': this.formService.educationInfo.otherQualifications
    });

    if(this.isSummaryMode) {
      this.educationInfoForm.disable()
    }
  }

  initDegree() {
        return this.formBuilder.group({
            id: [''],
            degTitle: ['', Validators.required],
            uni: ['', Validators.required],
            yoa: new FormControl('', [Validators.required, CustomValidators.selectionRequired, CustomValidators.validateYear.bind(this)]),
            gpa: ['', Validators.required],
            dateEntered: ['', Validators.required],
            dateLeft: ['', Validators.required]
        });
    }

    initOtherQualification() {
        return this.formBuilder.group({
            id: [''],
            otherQTitle: ['', Validators.required],
            orgTitle: ['', Validators.required],
            doa: ['', Validators.required],
            duration: ['', Validators.required]
        });
    }

    addDegree() {
        const control = <FormArray>this.educationInfoForm.controls['degrees'];
        control.push(this.initDegree());
    }

    removeDegree(i: number) {
        const control = <FormArray>this.educationInfoForm.controls['degrees'];
        control.removeAt(i);
    }

    addOtherQualification() {
        const control = <FormArray>this.educationInfoForm.controls['otherQualifications'];
        control.push(this.initOtherQualification());
    }

    removeOtherQualification(i: number) {
        const control = <FormArray>this.educationInfoForm.controls['otherQualifications'];
        control.removeAt(i);
    }

  onSubmit() {
      this.isSubmitClicked = true;
    if(this.educationInfoForm.valid){
    console.log(this.educationInfoForm.value);
    this.formService.addEducationInfo(this.educationInfoForm.value)
    this.router.navigate(['../job'], {relativeTo: this.route});
    }
  }

  onBack(){
    this.router.navigate(['../general'], {relativeTo: this.route});
  }

  canDeactivate(nextState: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.formService.isNextStateFormComplete(nextState.url)){
        return true;
    } else if (this.educationInfoForm.valid){
        this.formService.addEducationInfo(this.educationInfoForm.value)
        return true;
    } else {
        return false;
    }
  }
}
