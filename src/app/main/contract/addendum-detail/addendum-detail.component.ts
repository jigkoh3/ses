import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-addendum-detail',
  templateUrl: './addendum-detail.component.html',
  styleUrls: ['./addendum-detail.component.scss']
})
export class AddendumDetailComponent implements OnInit {
  transactions: any = [
    {
      no: '1',
      productName:'REFINED SUGAR',
      Quantity: '12000.00',
      packingUnit: '1BAG x 50KG',
      packingQty: '240000.00',
      unit: 'BAG',
      shipmentPeriod: '20/02/2018 - 20/05/2018',
      priceType: 'provisional price',
      sugarCost: '12,457.01',
      packingPost: '318.0000',
      unitPrice: '12,457.0100'
    }
  ];
  displayedColumns = [
    'No',
    'Product-Name',
    'Quantity',
    'Packing-Unit',
    'Packing-Qty',
    'Unit',
    'Shipment-Period',
    'Price-Type',
    'Sugar-Cost',
    'Packing-Post',
    'Unit-Price',
    'Manage'
  ];
  constructor() { }

  ngOnInit() {
  }

}
