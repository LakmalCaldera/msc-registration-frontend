import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/Http';
import { FormArray, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute, RouterStateSnapshot } from '@angular/router';

import { CustomValidators } from './../custom.validators';
import { FormService } from './../form.service';

@Component({
  selector: 'app-student-instruction',
  templateUrl: './student-instruction.component.html',
  styleUrls: ['./student-instruction.component.css']
})
export class StudentInstructionComponent implements OnInit {

  constructor(private formService: FormService, private router: Router,
              private route: ActivatedRoute, private formBuilder: FormBuilder) {}

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  onNext() {
    this.router.navigate(['../general'], {relativeTo: this.route});
  }


}
