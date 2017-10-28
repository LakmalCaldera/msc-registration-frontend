import {Component, AfterViewInit} from '@angular/core';
import {Router, ActivatedRoute, RouterStateSnapshot, Params} from '@angular/router';
import {FormService} from './../form.service';
import {Response} from '@angular/Http';

@Component({
  selector: 'app-registration-success-message',
  templateUrl: './registration-success-message.component.html',
  styleUrls: ['./registration-success-message.component.css']
})
export class RegistrationSuccessMessageComponent implements AfterViewInit {

  constructor(private formService:FormService, private router:Router,
              private route:ActivatedRoute) {
  }

  ngAfterViewInit() {
    if (!this.formService.isGeneralFormComplete() || !this.formService.isEducationFormCompelete() || !this.formService.isJobFormCompelete() || !this.formService.isRefereeFormCompelete()) {
      this.route.queryParams.subscribe((params:Params) => {
        let secret = params['secret'];
        if (secret) {
          this.formService.getFormDataFromHash(secret).subscribe((res:Response) => {
            if (res != null) {
              this.formService.loadUserData(res)
              this.formService.setUserRegistered()
            } else {
              this.formService.resetRegisteredUser()
            }
          }, (res:Response) => {
            this.router.navigate(['../request-error'], {relativeTo: this.route});
          });
        }
      });
    }
  }

  onBackToForm() {
    this.router.navigate(['../summary'], {relativeTo: this.route});
  }
}
