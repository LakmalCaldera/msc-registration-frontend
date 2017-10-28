import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-common-header',
  templateUrl: './common-header.component.html',
  styleUrls: ['./common-header.component.css']
})
export class CommonHeaderComponent implements OnInit {
  @Input() headerTitle : string
  @Input() customMessage : string = "Fill the below form:"
  @Input() removeDetail : boolean = false
  year : string
  constructor() {
    this.year = `${new Date().getFullYear()}/${new Date().getFullYear()+1}`;
  }

  ngOnInit() {
  }
}
