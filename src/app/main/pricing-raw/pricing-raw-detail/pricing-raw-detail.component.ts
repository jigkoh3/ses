import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { months } from 'moment';
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
  dataPricing = {
    status: 200,
    typeofsugar: 'Hi-Raw',
    buyer: 'ED & F Man',
    groupfactory: 'tr-group',
    futuremarket: 'No. 11',
    buyercontractno: 'P29599',
    contractdate: '20/02/2017',
    contractmonth: 'March',
    qty: 24000,
    shipment: {
      startdate: '20/02/2018',
      enddate: '20/05/2018'
    },
    contractno: '06818/TR',
    premium: '0.83',
    contractyear: '2019',
    whitepremium: {
      totalpricingrequest: 5000,
      month: 'March',
      totalpricing: 100,
      totalpricing2: 98,
      year: '2018'
    },
    totalAll: {
      averageprice: 14.983,
      other: -0.02,
      premium: 0.83,
      finalprice: 15.793,
      equivalent: 348.18,
      totalpricing: 472,
      priced: 30,
      unpriced: 442
    }
  }
  panelOpenState = false;
  hideCol: any;
  breakpoint: any;
  breakpoint2: any;
  breakpoint3: any;
  breakpoint4: any;
  breakpoint5: any;
  breakpoint6: any;
  typeofsugar: Array<any> = [
    { value: 'WHITE SUGAR', viewValue: 'WHITE SUGAR' },
    { value: 'REFINED SUGAR', viewValue: 'REFINED SUGAR' },
    { value: 'Hi-Raw', viewValue: 'Hi-Raw' }
  ];
  buyer: Array<any> = [
    { value: 'ED & F Man', viewValue: 'ED & F Man' },
    { value: 'Alvean', viewValue: 'Alvean' },
    { value: 'Bunge', viewValue: 'Bunge' }
  ]
  groupFactory: Array<any> = [
    { value: 'tr-group', viewValue: 'TR-กลุ่มไทยรุ่งเรือง' },
  ]
  contactNo: Array<any> = [
    { value: '06818/TR', viewValue: '06818/TR' },
    { value: '07118/TR', viewValue: '07118/TR' },
    { value: '07218/TR', viewValue: '07218/TR' }
  ]
  months: Array<any> = [
    { value: 'January', viewValue: 'January' },
    { value: 'February', viewValue: 'February' },
    { value: 'March', viewValue: 'March' },
    { value: 'April', viewValue: 'April' },
    { value: 'May', viewValue: 'May' },
    { value: 'June', viewValue: 'June' },
    { value: 'July', viewValue: 'July' },
    { value: 'August', viewValue: 'August' },
    { value: 'September', viewValue: 'September' },
    { value: 'October', viewValue: 'October' },
    { value: 'November', viewValue: 'Novembe' },
    { value: 'December', viewValue: 'December' }
  ]
  year: Array<any> = [
    { value: '2018', viewValue: '2018' },
    { value: '2019', viewValue: '2019' },

  ]
 
  newYorkNo11Table: Array<any> = [
    { orderdate: '17/05/2018', sell: 45, buy: '', against: 'No.11', mon: 'Mar', year: '2018', price: '11.93', unit: 'cents/pound', executed: '17/05/2018' },
    { orderdate: '18/05/2018', sell: 15, buy: '', against: 'No.11', mon: 'Mar', year: '2018', price: '12.00', unit: 'cents/pound', executed: '18/05/2018' },
    { orderdate: '21/05/2018', sell: 30, buy: '', against: 'No.11', mon: 'Mar', year: '2018', price: '12.13', unit: 'cents/pound', executed: '21/05/2018' },
    { orderdate: '23/05/2018', sell: 28, buy: '', against: 'No.11', mon: 'Mar', year: '2018', price: '12.73', unit: 'cents/pound', executed: '23/05/2018' },
  ]
  columnLondon: string[] = ['orderdate', 'sell', 'buy', 'against', 'mon', 'year', 'price', 'executed', 'Manage']

  londonTable: Array<any> = [
    { orderdate: '18/10/2017', sell: 25, buy: null, against: 'No.11', mon: 'Mar', year: '2018', price: '14.90', executed: '27/10/2017' },
    { orderdate: '18/10/2017', sell: null, buy: 25, against: 'No.11', mon: 'Mar', year: '2018', price: '14.60', executed: '28/10/2017' },
    { orderdate: '19/10/2017', sell: 20, buy: null, against: 'No.11', mon: 'Mar', year: '2018', price: '14.50', executed: '29/10/2017' },
    { orderdate: '30/10/2017', sell: null, buy: 20, against: 'No.11', mon: 'Mar', year: '2018', price: '14.60', executed: '29/10/2017' },
    { orderdate: '31/10/2017', sell: 30, buy: null, against: 'No.11', mon: 'Mar', year: '2018', price: '14.80', executed: '30/10/2017' },

  ]
  columnOthers: string[] = ['others', 'amont', 'unit', 'manage']
  othersTable: Array<any> = [
    { others: 'free', amont: '-0.02', unit: 'cents/pound' },
    { others: '...', amont: '', unit: '' }
  ]
  constructor(
  ) { }

  ngOnInit() {
    this.breakpoint = (window.innerWidth <= 400) ? 2 : 1;
    this.breakpoint2 = (window.innerWidth <= 400) ? 3 : 1;
    this.breakpoint3 = (window.innerWidth <= 400) ? 6 : 3;
    this.breakpoint4 = (window.innerWidth <= 400) ? 2 : 4;
    this.breakpoint5 = (window.innerWidth <= 400) ? 2 : 3;
    this.breakpoint6 = (window.innerWidth <= 400) ? 3 : 2;

    this.hideCol = window.innerWidth;
  }
  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 400) ? 2 : 1;
    this.hideCol = event.target.innerWidth;
  }
  onResize2(event) {
    this.breakpoint = (event.target.innerWidth <= 400) ? 2 : 1;
    this.breakpoint2 = (event.target.innerWidth <= 400) ? 3 : 1;
    this.breakpoint3 = (event.target.innerWidth <= 400) ? 6 : 3;
    this.breakpoint4 = (event.target.innerWidth <= 400) ? 2 : 4;
    this.breakpoint5 = (event.target.innerWidth <= 400) ? 2 : 3;
    this.breakpoint6 = (event.target.innerWidth <= 400) ? 3 : 2;

    this.hideCol = event.target.innerWidth;
  }
  onDelete() {
    confirm('คุณต้องการลบหรือไม่')
  }
}
