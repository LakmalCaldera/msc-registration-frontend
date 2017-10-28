import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/Http';
import { FormArray, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute, RouterStateSnapshot } from '@angular/router';

import { CustomValidators } from './../custom.validators';
import { FormService } from './../form.service';

@Component({
  selector: 'app-login-info-form',
  templateUrl: './login-info-form.component.html',
  styleUrls: ['./login-info-form.component.css']
})
export class LoginInfoFormComponent implements OnInit {

  loginInfoForm: FormGroup;
  isSubmitClicked: boolean = false;
  isCapchaValid: boolean = false;
  captchaToken: string;

  constructor(private formService: FormService, private router: Router,
              private route: ActivatedRoute, private formBuilder: FormBuilder) {}

  ngOnInit() {
    window.scrollTo(0, 0);

    // Create Form
    this.loginInfoForm = this.formBuilder.group({
        nic: new FormControl(null, [Validators.required])
    });

    // Set model data into form
    this.loginInfoForm.setValue({
        'nic': this.formService.generalInfo.nic
    });
  }

  onSubmit() {
      this.isSubmitClicked = true;
      if(this.loginInfoForm.valid){
        this.formService.addLoginInfo(this.loginInfoForm.value)
        this.formService.resetForm()
        this.formService.getFormData(this.loginInfoForm.value.nic, this.captchaToken).subscribe((res: Response) => {
          if (res != null) {
            this.formService.loadUserData(res)
            this.formService.setUserRegistered()
          } else {
            this.formService.resetRegisteredUser()
          }
          this.router.navigate(['../instruction'], {relativeTo: this.route});
        }, (res: Response) => {
          this.router.navigate(['../request-error'], {relativeTo: this.route});
        });
      }
    }

  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response ${captchaResponse}:`);
    this.captchaToken = captchaResponse;
    this.isCapchaValid = true;
  }
}
