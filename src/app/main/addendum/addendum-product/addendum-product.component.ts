import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-addendum-product',
  templateUrl: './addendum-product.component.html',
  styleUrls: ['./addendum-product.component.scss']
})
export class AddendumProductComponent implements OnInit {
  typeofsugar: Array<any> = [
    { value: 'WHITE SUGAR', viewValue: 'WHITE SUGAR' },
    { value: 'REFINED SUGAR', viewValue: 'REFINED SUGAR' },
    { value: 'Hi-Raw', viewValue: 'Hi-Raw' }
  ];
  year = '2017/2018'
  constructor() { }

  ngOnInit() {
  }

}
