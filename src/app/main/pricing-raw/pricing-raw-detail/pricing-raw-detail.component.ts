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
  hideCol: any;
  breakpoint: any;
  breakpoint2: any;
  foods: Food[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' }
  ];
  displayedColumns: string[] = ['date', 'lots', 'Price (USD/MT)', 'Manage'];
  transactions: Array<any> = [
    { date: '23/05/2018', lots: 60, Price: 341.9 },
    { date: '23/05/2018', lots: 60, Price: 341.6 }
  ];
  buyNewYorkNo11: Array<any> = [
    { date: '23/05/2018', lots: 60, Price: 12.56 },
    { date: '06/06/2018', lots: 60, Price: 12.41 },
    { date: '08/06/2018', lots: -2, Price: 12.3 }
  ]
  columnsNewYork: string[] = ['orderdate', 'sell', 'buy', 'against', 'mon', 'year', 'price', 'unit', 'executed', 'Manage']
  // columnsNewYork: string[] = ['orderdate', 'sell', 'buy', 'against', 'price', 'unit', 'executed', 'Manage']
  newYorkNo11Table: Array<any> = [
    { orderdate: '17/05/2018', sell: 45, buy: '', against: 'No.11', mon: 'Mar', year: '2018', price: '11.93', unit: 'cents/pound', executed: '17/05/2018' },
    { orderdate: '18/05/2018', sell: 15, buy: '', against: 'No.11', mon: 'Mar', year: '2018', price: '12.00', unit: 'cents/pound', executed: '18/05/2018' },
    { orderdate: '21/05/2018', sell: 30, buy: '', against: 'No.11', mon: 'Mar', year: '2018', price: '12.13', unit: 'cents/pound', executed: '21/05/2018' },
    { orderdate: '23/05/2018', sell: 28, buy: '', against: 'No.11', mon: 'Mar', year: '2018', price: '12.73', unit: 'cents/pound', executed: '23/05/2018' },
  ]
  columnLondon: string[] = ['orderdate', 'sell', 'buy', 'against', 'mon', 'year', 'price', 'unit', 'executed', 'Manage']

  londonTable: Array<any> = [
    { orderdate: '24/05/2018', sell: 40, buy: '', against: 'No.5', mon: 'Mar', year: '2018', price: '348.00', unit: 'USD/MT', executed: '24/05/2018' },
    { orderdate: '25/05/2018', sell: 40, buy: '', against: 'No.5', mon: 'Mar', year: '2018', price: '350.00', unit: 'USD/MT', executed: '25/05/2018' },
    { orderdate: '26/05/2018', sell: 40, buy: '', against: 'No.5', mon: 'Mar', year: '2018', price: '352.00', unit: 'USD/MT', executed: '26/05/2018' },
  ]
  columnOthers: string[] = ['others', 'amont', 'unit', 'manage']
  othersTable: Array<any> = [
    { others: 'free', amont: '-0.50', unit: 'USD/MT' },
    { others: '...', amont: '', unit: '' }

  ]
  constructor(
  ) { }

  ngOnInit() {
    this.breakpoint = (window.innerWidth <= 400) ? 2 : 1;
    this.breakpoint2 = (window.innerWidth <= 400) ? 3 : 1;
    this.hideCol = window.innerWidth;
  }
  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 400) ? 2 : 1;
    this.hideCol = event.target.innerWidth;
  }
  onResize2(event) {
    this.breakpoint2 = (event.target.innerWidth <= 400) ? 3 : 1;
  }
}
