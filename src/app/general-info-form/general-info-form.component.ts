import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';

import { CustomValidators } from './../custom.validators';
import { FormService } from './../form.service';
import { CanComponentDeactivate } from './../can-deactivate-guard.service';

// import {DpDayPickerComponent} from 'ng2-date-picker';

@Component({
  selector: 'app-general-info-form',
  templateUrl: './general-info-form.component.html',
  styleUrls: ['./general-info-form.component.css']
})
export class GeneralInfoFormComponent implements OnInit, CanComponentDeactivate {

  generalInfoForm: FormGroup;
  isSubmitClicked: boolean = false;
  isNicReadOnly: boolean = false;
  firstProgramFormControl: FormControl;
  secondProgramFormControl: FormControl;
  thirdProgramFormControl: FormControl;
  nicFormControl: FormControl;
  firstSelectionDegreePrograms;
  secondSelectionDegreePrograms;
  thirdSelectionDegreePrograms;
  @Input('summary') isSummaryMode;
  @Input('removeHeaderDetail') removeDetail;


  titles = [{ value: 'NONE', text: 'Choose...' },
  { value: 'Mr.', text: 'Mr.' },    // 0
  { value: 'Miss.', text: 'Miss.' },  // 1
  { value: 'Mrs.', text: 'Mrs.' },   // 2
  { value: 'Rev.', text: 'Rev.' },   // 3
  { value: 'Dr.', text: 'Dr.' }];   // 4

  genders = [{ value: 'NONE', text: 'Choose...' },
  { value: 'Male', text: 'Male' },     // 0
  { value: 'Female', text: 'Female' }];  // 1
  degreePrograms = [{ value: 'NONE', text: 'Choose...' },
  { value: 'MCS', text: 'Master of Computer Science (MCS)' },
  { value: 'MIS', text: 'Master of Science in Information Security (MIS)' },
  { value: 'MIT', text: 'Master of Information Technology' }];

  misProgramSelection = [{ value: 'NONE', text: 'Choose...' },
  { value: 'MIS', text: 'Master of Science in Information Security (MIS)' }];

  mitProgramSelection = [{ value: 'NONE', text: 'Choose...' },
  { value: 'MIT', text: 'Master of Information Technology' }];

  mitAndMisProgramSelection = [{ value: 'NONE', text: 'Choose...' },
  { value: 'MIS', text: 'Master of Science in Information Security (MIS)' },
  { value: 'MIT', text: 'Master of Information Technology' }];

  constructor(private formService: FormService, private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.firstSelectionDegreePrograms = this.degreePrograms;
    this.secondSelectionDegreePrograms = this.degreePrograms;
    this.thirdSelectionDegreePrograms = this.degreePrograms;


    this.firstProgramFormControl = new FormControl(null, [Validators.required, CustomValidators.selectionRequired])
    this.secondProgramFormControl = new FormControl(null, [])
    this.thirdProgramFormControl = new FormControl(null, [])

    if (!this.isSummaryMode) {
      this.firstProgramFormControl.valueChanges.subscribe(data => {
        if (data == this.degreePrograms[1].value) {
          // If MCS
          // 1. Unblock other selections
          // 2. Serve all three options

          this.secondProgramFormControl.enable()
          if (this.secondProgramFormControl.value == this.degreePrograms[0].value) {
            this.thirdProgramFormControl.disable()
          } else {
            this.thirdProgramFormControl.enable()
          }

          this.secondSelectionDegreePrograms = this.mitAndMisProgramSelection;
          this.thirdSelectionDegreePrograms = this.mitAndMisProgramSelection;

          this.secondProgramFormControl.patchValue(this.degreePrograms[0].value);
          this.thirdProgramFormControl.patchValue(this.degreePrograms[0].value);

        }
        else if (data == this.degreePrograms[2].value) {
          // If MIS
          // 1. Reset and Block last selection
          // 2. Serve optionally MIT in second selection only

          this.thirdProgramFormControl.disable();
          this.secondProgramFormControl.enable();
          this.secondSelectionDegreePrograms = this.mitProgramSelection;

          this.secondProgramFormControl.patchValue(this.degreePrograms[0].value);
          this.thirdProgramFormControl.patchValue(this.degreePrograms[0].value);

        } else if (data == this.degreePrograms[3].value) {
          // If MIT
          // 1. Reset and Block last selection
          // 2. Serve optionally MIS in second selection only

          this.thirdProgramFormControl.disable();
          this.secondProgramFormControl.enable();
          this.secondSelectionDegreePrograms = this.misProgramSelection;

          this.secondProgramFormControl.patchValue(this.degreePrograms[0].value);
          this.thirdProgramFormControl.patchValue(this.degreePrograms[0].value);

        } else {
          this.secondProgramFormControl.disable()
          this.thirdProgramFormControl.disable()
          this.secondProgramFormControl.patchValue(this.degreePrograms[0].value);
          this.thirdProgramFormControl.patchValue(this.degreePrograms[0].value);
        }
      });

      this.secondProgramFormControl.valueChanges.subscribe(data => {
        if (this.firstProgramFormControl.value == this.degreePrograms[1].value && this.secondProgramFormControl.value != this.degreePrograms[0].value) {
          this.thirdProgramFormControl.enable()
        } else {
          this.thirdProgramFormControl.disable()
        }
        if (this.firstProgramFormControl.value != this.degreePrograms[0].value) {

          if (data == this.degreePrograms[0].value) {
            this.thirdSelectionDegreePrograms = this.mitAndMisProgramSelection;
          }
          else if (data == this.degreePrograms[2].value) {
            this.thirdSelectionDegreePrograms = this.mitProgramSelection;
            this.thirdProgramFormControl.patchValue(this.degreePrograms[0].value);
          }
          else if (data == this.degreePrograms[3].value) {
            this.thirdSelectionDegreePrograms = this.misProgramSelection;
            this.thirdProgramFormControl.patchValue(this.degreePrograms[0].value);
          }
        }
      });

      if (this.formService.isUserRegistered()) {
        this.isNicReadOnly = true;
      } else {
        this.isNicReadOnly = false;
      }
    }
    // Create form
    this.generalInfoForm = new FormGroup({
      'firstProgram': this.firstProgramFormControl,
      'secondProgram': this.secondProgramFormControl,
      'thirdProgram': this.thirdProgramFormControl,
      'title': new FormControl(null, [Validators.required, CustomValidators.selectionRequired]),
      'name_with_initial': new FormControl(null, [Validators.required]),
      'fullName': new FormControl(null, [Validators.required]),
      'gender': new FormControl(null, [Validators.required, CustomValidators.selectionRequired]),
      'dob': new FormControl(null, [Validators.required]),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'nic': new FormControl(null, [Validators.required]),
      'mobileno': new FormControl(null, [Validators.required, CustomValidators.validatePhoneNumber]),
      'homeno': new FormControl(null, [Validators.required, CustomValidators.validatePhoneNumber]),
      'address': new FormControl(null, [Validators.required])
    });

    // Set model data into form
    this.generalInfoForm.patchValue({
      'firstProgram': this.formService.generalInfo.firstProgram ? this.formService.generalInfo.firstProgram : this.degreePrograms[0].value,
      'secondProgram': this.formService.generalInfo.secondProgram ? this.formService.generalInfo.secondProgram : this.degreePrograms[0].value,
      'thirdProgram': this.formService.generalInfo.thirdProgram ? this.formService.generalInfo.thirdProgram : this.degreePrograms[0].value,
      'title': this.formService.generalInfo.title ? this.getTitle(this.formService.generalInfo.title) : this.titles[0].value,
      'name_with_initial': this.formService.generalInfo.name_with_initial,
      'fullName': this.formService.generalInfo.fullName,
      'gender': this.formService.generalInfo.gender ? this.getGender(this.formService.generalInfo.gender) : this.genders[0].value,
      'dob': this.formService.generalInfo.dob,
      'email': this.formService.generalInfo.email,
      'nic': this.formService.generalInfo.nic,
      'mobileno': this.formService.generalInfo.mobileno,
      'homeno': this.formService.generalInfo.homeno,
      'address': this.formService.generalInfo.address,
    });

    if (this.isSummaryMode) {
      this.generalInfoForm.disable()
    }
  }

  // This is a patch for a bug in the production system
  getTitle(val): string {
    switch (val) {
      case "0":
        return 'Mr.'
      case "1":
        return 'Miss.'
      case "2":
        return 'Mrs.'
      case "3":
        return 'Rev.'
      case "4":
        return 'Dr.'
      default:
        return val
    }
  }

  getGender(val): string {
    switch (val) {
      case "0":
        return 'Male'
      case "1":
        return 'Female'
      default:
        return val
    }
  }

  onSubmit() {
    this.isSubmitClicked = true;
    if (this.generalInfoForm.valid) {
      console.log(this.generalInfoForm.value);
      this.formService.addGeneralInfo(this.generalInfoForm.value);
      this.router.navigate(['../education'], { relativeTo: this.route });
    }
  }

  canDeactivate(nextState): Observable<boolean> | Promise<boolean> | boolean {
    if (this.formService.isNextStateFormComplete(nextState.url)) {
      return true;
    } else if (this.generalInfoForm.valid) {
      this.formService.addGeneralInfo(this.generalInfoForm.value)
      return true;
    } else {
      return false;
    }
  }

  onBack() {
    this.router.navigate(['../instruction'], { relativeTo: this.route });
  }
}
