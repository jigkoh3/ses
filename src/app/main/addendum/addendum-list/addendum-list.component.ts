import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addendum-list',
  templateUrl: './addendum-list.component.html',
  styleUrls: ['./addendum-list.component.scss']
})
export class AddendumListComponent implements OnInit {

  total: any;
  lots: any;
  screenwidth: any;
  data: any[] = [
    {
      contract: '00116/TRR',
      contractDate:'20/02/2017',
      buyerContract: 'HKP2403',
      buyer: 'ED & F Man',
      sugarType: 'REFINED SUGAR',
      madeon: 'ตปท.',
      cropYear: '2017',
      groupFactory: 'TR-กลุ่มไทยรุ่งเรือง',
      shipmentTerm: 'FOB',
      shipmentPeriod:'20/02/2018 - 20/05/2018',
      quantity: '12000',
      shipment: '',
      paymentTerm: 'T/T',
      currency:'THB',
      contractStatus: 'Draft',
      details: [
        {
          addendum: '1',
          addendumDate: '20/02/2017',
          addendumType: 'Final Price',
          addendumStatus: 'Draft',
          sugarType: 'REFINED SUGAR',
          buyerContract: 'HKP2403',
          buyer: 'ED & F Man',
          quantity: 12000
       
        },{
          addendum: '1',
          addendumDate: '20/02/2017',
          addendumType: 'Final Price',
          addendumStatus: 'Draft',
          sugarType: 'REFINED SUGAR',
          buyerContract: 'HKP2403',
          buyer: 'ED & F Man',
          quantity: 12000
        },{
          addendum: '1',
          addendumDate: '20/02/2017',
          addendumType: 'Final Price',
          addendumStatus: 'Draft',
          sugarType: 'REFINED SUGAR',
          buyerContract: 'HKP2403',
          buyer: 'ED & F Man',
          quantity: 12000
        },
      ]
    },{
      contract: '00116/TRR',
      contractDate:'20/02/2017',
      buyerContract: 'HKP2403',
      buyer: 'ED & F Man',
      sugarType: 'REFINED SUGAR',
      madeon: 'ตปท.',
      cropYear: '2017',
      groupFactory: 'TR-กลุ่มไทยรุ่งเรือง',
      shipmentTerm: 'FOB',
      shipmentPeriod:'20/02/2018 - 20/05/2018',
      quantity: '12000',
      shipment: '',
      paymentTerm: 'T/T',
      currency:'THB',
      contractStatus: 'Draft',
      details: [
        {
          addendum: '1',
          addendumDate: '20/02/2017',
          addendumType: 'Final Price',
          addendumStatus: 'Draft',
          sugarType: 'REFINED SUGAR',
          buyerContract: 'HKP2403',
          buyer: 'ED & F Man',
          quantity: 12000
       
        },{
          addendum: '1',
          addendumDate: '20/02/2017',
          addendumType: 'Final Price',
          addendumStatus: 'Draft',
          sugarType: 'REFINED SUGAR',
          buyerContract: 'HKP2403',
          buyer: 'ED & F Man',
          quantity: 12000
        },{
          addendum: '1',
          addendumDate: '20/02/2017',
          addendumType: 'Final Price',
          addendumStatus: 'Draft',
          sugarType: 'REFINED SUGAR',
          buyerContract: 'HKP2403',
          buyer: 'ED & F Man',
          quantity: 12000
        },
      ]
    }
  ];
  displayedColumns = [
    'Contract-No',
    'ContractDate',
    'Buyer-Contract',
    'Buyer',
    'Sugar-Type',
    'Made-on',
    'Crop-Year',
    'Group-Factory',
    'Shipment-Term',
    'Shipment-Period',
    'Quantity',
    'Shipment',
    'Payment-Term',
    'Currency',
    'Contract-Status',
    'Manage'
  ];
  displayedColumns2 = [
    'Addendum-No',
    'Addendum-Date',
    'Addendum-Type',
    'Addendum-Status',
    'Sugar-Type',
    'Buyer-Contract',
    'Buyer',
    'Quantity',
    'Manage'
  ];
  transactions: any = [
    {
      contract: '00116/TRR',
      contractDate:'20/02/2017',
      buyerContract: 'HKP2403',
      buyer: 'ED & F Man',
      sugarType: 'REFINED SUGAR',
      madeon: 'ตปท.',
      cropYear: '2017',
      groupFactory: 'TR-กลุ่มไทยรุ่งเรือง',
      shipmentTerm: 'FOB',
      shipmentPeriod:'20/02/2018 - 20/05/2018',
      quantity: '12000',
      shipment: '',
      paymentTerm: 'T/T',
      currency:'THB',
      contractStatus: 'Draft'
    }
  ];
  transactions2: any = [
    {
      addendum: '1',
      addendumDate: '20/02/2017',
      addendumType: 'Final Price',
      addendumStatus: 'Draft',
      sugarType:'REFINED SUGAR',
      buyerContract: 'HKP2403',
      buyer: 'ED & F Man',
      quantity: 12000
    },{
      addendum: '1',
      addendumDate: '20/02/2017',
      addendumType: 'Final Price',
      addendumStatus: 'Draft',
      sugarType:'REFINED SUGAR',
      buyerContract: 'HKP2403',
      buyer: 'ED & F Man',
      quantity: 12000
    },{
      addendum: '1',
      addendumDate: '20/02/2017',
      addendumType: 'Final Price',
      addendumStatus: 'Draft',
      sugarType:'REFINED SUGAR',
      buyerContract: 'HKP2403',
      buyer: 'ED & F Man',
      quantity: 12000
    },{
      addendum: '1',
      addendumDate: '20/02/2017',
      addendumType: 'Final Price',
      addendumStatus: 'Draft',
      sugarType:'REFINED SUGAR',
      buyerContract: 'HKP2403',
      buyer: 'ED & F Man',
      quantity: 12000
    }
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
