import {Component, AfterViewInit} from '@angular/core';
import {Router, ActivatedRoute, RouterStateSnapshot, Params} from '@angular/router';
import {FormService} from './../form.service';
import {Response} from '@angular/Http';
import {Location} from '@angular/common';

@Component({
  selector: 'app-request-error',
  templateUrl: './request-error.component.html',
  styleUrls: ['./request-error.component.css']
})
export class RequestErrorComponent implements AfterViewInit {

  constructor(private location: Location, private formService:FormService, private router:Router,
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

  onBack() {
    this.location.back()
  }

}
