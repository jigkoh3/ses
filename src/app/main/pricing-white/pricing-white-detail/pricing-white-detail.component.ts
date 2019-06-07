import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pricing-white-detail',
  templateUrl: './pricing-white-detail.component.html',
  styleUrls: ['./pricing-white-detail.component.scss']
})
export class PricingWhiteDetailComponent implements OnInit {
  dataPricing = {
    status: 200,
    typeofsugar: 'WHITE SUGAR',
    buyer: 'ED & F Man',
    groupfactory: 'tr-group',
    buyercontractno: 'P29599',
    contractdate: '20/02/2017',
    contractmonth: 'March',
    cropyear: '2018',
    contractmadeby: 'ISD',
    portion: 'Management',
    qty: 12000,
    shipment: {
      startdate: '20/02/2018',
      enddate: '20/05/2018'
    },
    contractno: '06818/TR',
    premium: '16',
    contractyear: '2019',
    whitepremium: {
      totalpricingrequest: 5000,
      month: 'March',
      totalpricing: 100,
      totalpricing2: 98,
      year: '2018'
    },
    totalAll: {
      averageprice: 342.47,
      other: -0.50,
      premium: 16,
      finalprice: 357.97,
      totalpricing: 240,
      priced: 238,
      unpriced: 2
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
  contractmadeby: Array<any> = [
    { value: 'ISD', viewValue: 'ISD' },
  ]
  portion: Array<any> = [
    { value: 'Management', viewValue: 'Management' }

  ]
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
    { orderdate: '17/05/2018', sell: 45, buy: '', against: 'No.11', mon: 'March', year: '2018', price: '11.93', unit: 'cents/pound', executed: '17/05/2018' },
    { orderdate: '18/05/2018', sell: 15, buy: '', against: 'No.11', mon: 'March', year: '2018', price: '12.00', unit: 'cents/pound', executed: '18/05/2018' },
    { orderdate: '21/05/2018', sell: 30, buy: '', against: 'No.11', mon: 'March', year: '2018', price: '12.13', unit: 'cents/pound', executed: '21/05/2018' },
    { orderdate: '23/05/2018', sell: 28, buy: '', against: 'No.11', mon: 'March', year: '2018', price: '12.73', unit: 'cents/pound', executed: '23/05/2018' },
  ]
  columnLondon: string[] = ['orderdate', 'sell', 'buy', 'against', 'mon', 'year', 'price', 'unit', 'executed', 'Manage']

  londonTable: Array<any> = [
    { orderdate: '24/05/2018', sell: 40, buy: '', against: 'No.5', mon: 'March', year: '2018', price: '348.00', unit: 'USD/MT', executed: '24/05/2018' },
    { orderdate: '25/05/2018', sell: 40, buy: '', against: 'No.5', mon: 'March', year: '2018', price: '350.00', unit: 'USD/MT', executed: '25/05/2018' },
    { orderdate: '26/05/2018', sell: 40, buy: '', against: 'No.5', mon: 'March', year: '2018', price: '352.00', unit: 'USD/MT', executed: '26/05/2018' },
  ]
  columnOthers: string[] = ['others', 'amont', 'unit', 'manage']
  othersTable: Array<any> = [
    { others: 'free', amont: '-0.50', unit: 'USD/MT' },
    { others: '...', amont: '', unit: '' }
  ];
  breakpoint7: any;
  breakpoint8: any;
  breakpoint9: any;
  breakpoint10: any;
  constructor() { }

  ngOnInit() {
    this.breakpoint = (window.innerWidth <= 400) ? 4 : 2;
    this.breakpoint2 = (window.innerWidth <= 400) ? 3 : 1;
    this.breakpoint3 = (window.innerWidth <= 400) ? 6 : 3;
    this.breakpoint4 = (window.innerWidth <= 400) ? 2 : 4;
    this.breakpoint5 = (window.innerWidth <= 400) ? 2 : 3;
    this.breakpoint6 = (window.innerWidth <= 400) ? 3 : 2;
    this.breakpoint7 = (window.innerWidth <= 400) ? 2 : 2;
    this.breakpoint8 = (window.innerWidth <= 400) ? 1 : 1;
    this.breakpoint9 = (window.innerWidth <= 400) ? 3 : 2;
    this.breakpoint10 = (window.innerWidth <= 400) ? 6 : 2;
    this.hideCol = window.innerWidth;
  }
  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 400) ? 4 : 2;
    this.hideCol = event.target.innerWidth;
  }
  onResize2(event) {
    this.breakpoint = (event.target.innerWidth <= 400) ? 4 : 2;
    this.breakpoint2 = (event.target.innerWidth <= 400) ? 3 : 1;
    this.breakpoint3 = (event.target.innerWidth <= 400) ? 6 : 3;
    this.breakpoint4 = (event.target.innerWidth <= 400) ? 2 : 4;
    this.breakpoint5 = (event.target.innerWidth <= 400) ? 2 : 3;
    this.breakpoint6 = (event.target.innerWidth <= 400) ? 3 : 2;
    this.breakpoint7 = (window.innerWidth <= 400) ? 2 : 2;
    this.breakpoint8 = (window.innerWidth <= 400) ? 1 : 1;
    this.breakpoint9 = (window.innerWidth <= 400) ? 3 : 2;
    this.breakpoint10 = (window.innerWidth <= 400) ? 6 : 2;
    this.hideCol = event.target.innerWidth;
  }
  onDelete() {
    confirm('คุณต้องการลบหรือไม่')
  }
}
