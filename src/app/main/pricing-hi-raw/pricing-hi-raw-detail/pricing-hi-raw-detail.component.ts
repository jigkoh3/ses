import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { ODataConfiguration, ODataExecReturnType, ODataPagedResult, ODataQuery, ODataService, ODataServiceFactory } from 'angular-odata-es5'

import { ODataConfigurationFactory } from '../../../ODataConfigurationFactory';
import { Router } from '@angular/router';

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
