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
  displayedColumns = ['date', 'lots', 'Price (USD/MT)', 'Manage'];
  transactions: Array<any> = [
    { date: '23/05/2018', lots: 60, Price: 341.9 },
    { date: '23/05/2018', lots: 60, Price: 341.6 }

  ];
  constructor(
  ) { }

  ngOnInit() {
  }
 
}
