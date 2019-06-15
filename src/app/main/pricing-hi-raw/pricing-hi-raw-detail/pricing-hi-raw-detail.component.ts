import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { ODataConfiguration, ODataExecReturnType, ODataPagedResult, ODataQuery, ODataService, ODataServiceFactory } from 'angular-odata-es5'

import { ODataConfigurationFactory } from '../../../ODataConfigurationFactory';
import { Router } from '@angular/router';



const ELEMENT_DATA: Array<any> = [
  { orderdate: '17/05/2018', sell: 45, buy: '', against: 'No.11', 'mon': 'Mar', year: '2018', price: '11.93', unit: 'cents/pound', executed: '17/05/2018' },
  { orderdate: '18/05/2018', sell: '', buy: 45, against: 'No.11', mon: 'Mar', year: '2018', price: '12.00', unit: 'cents/pound', executed: '18/05/2018' },
  { orderdate: '21/05/2018', sell: 30, buy: '', against: 'No.11', mon: 'Mar', year: '2018', price: '12.13', unit: 'cents/pound', executed: '21/05/2018' },
  { orderdate: '23/05/2018', sell: '', buy: 28, against: 'No.11', mon: 'Mar', year: '2018', price: '12.73', unit: 'cents/pound', executed: '23/05/2018' },
]

@Component({
  selector: 'app-pricing-hi-raw-detail',
  templateUrl: './pricing-hi-raw-detail.component.html',
  styleUrls: ['./pricing-hi-raw-detail.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: ODataConfiguration, useFactory: ODataConfigurationFactory }, ODataServiceFactory],
})
export class PricingHiRawDetailComponent implements OnInit {
  form: FormGroup;

  displayedColumns: string[] = ['orderdate', 'sell', 'buy', 'against', 'mon', 'year', 'price',  'executed', 'star'];
  dataSource = ELEMENT_DATA;
  /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     */
  constructor(
    private _formBuilder: FormBuilder,
    public route: Router,
    private odataFactory: ODataServiceFactory
  ) {
    // Set the private defaults

  }

  ngOnInit() {
    this.form = this._formBuilder.group({
      buyer: [''],
      groupfactory: [''],
      buyercontractno: [''],
      contarctno: ['']
    });
  }

}
