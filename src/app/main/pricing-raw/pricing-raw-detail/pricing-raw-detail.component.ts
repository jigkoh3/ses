import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
export interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-pricing-raw-detail',
  templateUrl: './pricing-raw-detail.component.html',
  styleUrls: ['./pricing-raw-detail.component.scss']
})
export class PricingRawDetailComponent implements OnInit {
  foods: Food[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' }
  ];
  constructor(
  ) { }

  ngOnInit() {
  }

}
