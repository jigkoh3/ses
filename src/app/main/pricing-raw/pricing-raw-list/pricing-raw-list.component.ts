import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as english } from '../i18n/en';
import { locale as turkish } from '../i18n/tr';
@Component({
  selector: 'app-pricing-raw-list',
  templateUrl: './pricing-raw-list.component.html',
  styleUrls: ['./pricing-raw-list.component.scss']
})
export class PricingRawListComponent implements OnInit {
  total: any;
  lots: any;
  screenwidth: any;
  buyer: any = [
    { value: 'ED & F Man', viewValue: 'ED & F Man' },
    { value: 'Alvean', viewValue: 'Alvean' },
    { value: 'Bunge', viewValue: 'Bunge' }
  ];
  groupfactory: any = [
    { value: 'TR-กลุ่มไทยรุ่งเรือง', viewValue: 'TR-กลุ่มไทยรุ่งเรือง' },
    { value: 'TR-กลุ่มไทยรุ่งเรือง', viewValue: 'TR-กลุ่มไทยรุ่งเรือง' },
    // { value: 'pizza-1', viewValue: 'Pizza' },
    // { value: 'tacos-2', viewValue: 'Tacos' }
  ];
  buyercontacno: any = [
    { value: 'P29598', viewValue: 'P29598' },
    { value: 'HKP2403', viewValue: 'HKP2403' },
    { value: 'P6000', viewValue: 'P6000' }
  ];
  contactno: any = [
    { value: '06818/TR', viewValue: '06818/TR' },
    { value: '07118/TR', viewValue: '07118/TR' },
    { value: '07218/TR', viewValue: '07218/TR' }
  ];
  displayedColumns = [
    'Buyer',
    'Group-Factory',
    'Contract-No',
    'Buyer-Contract-No',
    'Contract-Date',
    'Contract-Date2',
    'Quantity',
    'Shipment-Period',
    'Total-Price',
    'Priced',
    'Unpriced',
    'Final-Price',
    'Final-Price2',
    'Last-Pricing-Date',
    'Against',
    'Manage',
  ];
  transactions: any = [
    {
      buyer: 'ED & F Man',
      groupfactory: 'TR-กลุ่มไทยรุ่งเรือง',
      contactno: '06818/TR',
      buyercontacno: 'P29598',
      contactdata: '20/02/2017',
      typeofsugar: 'WHITE SUGAR',
      quanitity: 12000,
      shipmentperiod: '20/02/2018 - 20/05/2018',
      // totalprice:'',
      priced: '',
      unpriced: '',
      finalpriceusdmt: '',
      finalpriceclb: '',
      lastpriceingdata: '31/10/2017',
      againstmonth: '',
      manage: '',
    },
    {
      buyer: 'Alvean',
      groupfactory: 'TR-กลุ่มไทยรุ่งเรือง',
      contactno: '07118/TR',
      buyercontacno: 'HKP2403',
      contactdata: '20/02/2017',
      typeofsugar: 'REFINED SUGAR',
      quanitity: 12000,
      shipmentperiod: '01/03/2018 - 31/05/2018',
      // totalprice:'',
      priced: '',
      unpriced: '',
      finalpriceusdmt: '',
      finalpriceclb: '',
      lastpriceingdata: '12/02/2018',
      againstmonth: '',
      manage: '',
    },
    {
      buyer: 'Bunge',
      groupfactory: 'TR-กลุ่มไทยรุ่งเรือง',
      contactno: '07218/TR',
      buyercontacno: 'P6000',
      contactdata: '01/09/2017',
      typeofsugar: 'REFINED SUGAR',
      quanitity: 9000,
      shipmentperiod: '',
      // totalprice:'',
      priced: '',
      unpriced: '',
      finalpriceusdmt: '',
      finalpriceclb: '',
      lastpriceingdata: '26/01/2018',
      againstmonth: '',
      manage: '',
    }, {
      buyer: 'Bunge',
      groupfactory: 'TR-กลุ่มไทยรุ่งเรือง',
      contactno: '07218/TR',
      buyercontacno: 'P6000',
      contactdata: '01/09/2017',
      typeofsugar: 'REFINED SUGAR',
      quanitity: 0,
      shipmentperiod: '',
      // totalprice:'',
      priced: '',
      unpriced: '',
      finalpriceusdmt: '',
      finalpriceclb: '',
      lastpriceingdata: '26/01/2018',
      againstmonth: '',
      manage: '',
    }, {
      buyer: 'Bunge',
      groupfactory: 'TR-กลุ่มไทยรุ่งเรือง',
      contactno: '07218/TR',
      buyercontacno: 'P6000',
      contactdata: '01/09/2017',
      typeofsugar: 'REFINED SUGAR',
      quanitity: 0,
      shipmentperiod: '',
      // totalprice:'',
      priced: '',
      unpriced: '',
      finalpriceusdmt: '',
      finalpriceclb: '',
      lastpriceingdata: '26/01/2018',
      againstmonth: '',
      manage: '',
    }, {
      buyer: 'Bunge',
      groupfactory: 'TR-กลุ่มไทยรุ่งเรือง',
      contactno: '07218/TR',
      buyercontacno: 'P6000',
      contactdata: '01/09/2017',
      typeofsugar: 'REFINED SUGAR',
      quanitity: 0,
      shipmentperiod: '',
      // totalprice:'',
      priced: '',
      unpriced: '',
      finalpriceusdmt: '',
      finalpriceclb: '',
      lastpriceingdata: '26/01/2018',
      againstmonth: '',
      manage: '',
    },
  ];
  colSpTopic: any;
  colSpSelect: any;
  colSpBtn: any;
  constructor(
    public route: Router
  ) {
  }

  ngOnInit() {
    this.colSpTopic = (window.innerWidth <= 400) ? 3 : 1;
    this.colSpSelect = (window.innerWidth <= 400) ? 3 : 1;
    this.colSpBtn = (window.innerWidth <= 400) ? 6 : 1;
    this.screenwidth = window.innerWidth
    this.calTotal();
  }

  onResize(event) {
    this.colSpTopic = (event.target.innerWidth <= 400) ? 3 : 1;
    this.colSpSelect = (event.target.innerWidth <= 400) ? 3 : 1;
    this.colSpBtn = (event.target.innerWidth <= 400) ? 6 : 1;
    this.screenwidth = event.target.innerWidth
  }

  onDetail() {
    this.route.navigate(['/pricing-Detail'])
  }

  onDelete() {
    confirm("คุณต้องการลบหรือไม่");
  }


  calTotal() {
    this.total = 0;
    this.lots = 0;
    this.transactions.forEach(tran => {
      this.total = this.total + tran.quanitity
      this.lots = this.lots + tran.quanitity / 50
    });
    console.log(this.total);
  }























}
