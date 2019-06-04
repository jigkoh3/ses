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
  foods: any = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' }
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
    { item: 'Beach ball', cost: 4 },
    { item: 'Towel', cost: 5 },
    { item: 'Frisbee', cost: 2 },
    { item: 'Sunscreen', cost: 4 },
    { item: 'Cooler', cost: 25 },
    { item: 'Swim suit', cost: 15 },
  ];
//   displayedColumns =
//   [ 'position', 'weight', 'symbol', 'position', 'weight', 'symbol'];
// dataSource: any = [
//   { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
//   { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
//   { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
//   { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
//   { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
//   { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
//   { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
//   { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
//   { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
//   { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
// ];

  constructor(
    public route: Router
  ) {
  }

  ngOnInit() {
  }

  onDetail() {
    this.route.navigate(['/pricing-Detail'])
  }
}
