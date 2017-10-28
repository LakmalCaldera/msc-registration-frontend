import {Component, OnInit} from '@angular/core';
import {FormService} from './../form.service';
import {ConfigService} from './../systemconfig.service';
import {Router, ActivatedRoute, RouterStateSnapshot, Params} from '@angular/router';

@Component({
  selector: 'app-payment-confirmation-form',
  templateUrl: './payment-confirmation-form.component.html',
  styleUrls: ['./payment-confirmation-form.component.css']
})
export class PaymentConfirmationFormComponent implements OnInit {

  isOkBtnClicked:boolean = false;

  constructor(private configService:ConfigService, private formService:FormService, private router:Router,
              private route:ActivatedRoute) {
  }

  ngOnInit() {
  }

  getName() {
    return this.formService.generalInfo ? this.formService.generalInfo.fullName : 'Kasun De Zoysa';
  }

  onNo() {
    this.router.navigate(['../summary'], {relativeTo: this.route});
  }

  onYes() {
    this.isOkBtnClicked = true;
    const secret = this.formService.getStudentHash() ? this.formService.getStudentHash() : "test";
    window.location.href = (`${this.configService.getPGWUrl()}/payment_init.php?secret=${secret}`);
  }
}
