import { Component, OnInit, ViewChild } from '@angular/core';
import {Router, ActivatedRoute, RouterStateSnapshot} from '@angular/router';
import {FormService} from './../form.service';
import {DomSanitizer,SafeResourceUrl,} from '@angular/platform-browser';
import {ConfigService} from '../systemconfig.service';

@Component({
  selector: 'app-payment-gateway-form',
  templateUrl: './payment-gateway-form.component.html',
  styleUrls: ['./payment-gateway-form.component.css']
})
export class PaymentGatewayFormComponent implements OnInit {

  url: SafeResourceUrl;

  constructor (public sanitizer:DomSanitizer, private formService:FormService, private router:Router,
               private route:ActivatedRoute, private configService:ConfigService) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    // If there is no secret, the payment gateway is being tested by third party payment gateway ppl and thus sending test as secret.
    const secret = this.formService.getStudentHash() ? this.formService.getStudentHash() : "test";
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.configService.getPGWUrl()}/payment_init.php?secret=${secret}`);
  }
}
