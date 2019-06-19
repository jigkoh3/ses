import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';
import { ODataConfiguration, ODataExecReturnType, ODataPagedResult, ODataQuery, ODataService, ODataServiceFactory } from 'angular-odata-es5'
import { ODataConfigurationFactory } from '../../../ODataConfigurationFactory';
import { combineLatest } from 'rxjs';
import * as _ from 'lodash';
import { Router, ActivatedRoute } from '@angular/router';
import { pricing } from 'app/shared/models/pricing';
import { UUID } from 'angular2-uuid';
import * as moment from 'moment';
import { lov_data } from 'app/shared/models/lov_data';
import { party } from 'app/shared/models/party';
import { MatDialog } from '@angular/material';
import { PricingTransFormComponent } from '../pricing-trans-form/pricing-trans-form.component';



const ELEMENT_DATA: Array<any> = [
  // { orderdate: '17/05/2018', sell: 45, buy: '', against: 'No.11', 'mon': 'Mar', year: '2018', price: '11.93', unit: 'cents/pound', executed: '17/05/2018' },
  // { orderdate: '18/05/2018', sell: '', buy: 45, against: 'No.11', mon: 'Mar', year: '2018', price: '12.00', unit: 'cents/pound', executed: '18/05/2018' },
  // { orderdate: '21/05/2018', sell: 30, buy: '', against: 'No.11', mon: 'Mar', year: '2018', price: '12.13', unit: 'cents/pound', executed: '21/05/2018' },
  // { orderdate: '23/05/2018', sell: '', buy: 28, against: 'No.11', mon: 'Mar', year: '2018', price: '12.73', unit: 'cents/pound', executed: '23/05/2018' },
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
  @ViewChild('dialogContent')
  dialogContent: TemplateRef<any>;
  form: FormGroup;

  displayedColumns: string[] = ['orderdate', 'sell', 'buy', 'against', 'mon', 'year', 'price', 'executed', 'star'];
  dataSource = ELEMENT_DATA;
  sub: any;
  id: any;
  mode: any;
  odata: ODataService<any>;
  odataLov: ODataService<lov_data>;
  odataParty: ODataService<party>;
  currentUser: any;
  user: any;
  allLOVs: any;
  allPartys: any;
  groupfactorys: string[];
  buyers: any[];
  sugar_types: string[];
  contract_months: any;
  contract_years: any[];
  crop_years: any[];
  curr_year: number;
  curr_crop_year: string;
  contract_made_ons: any[];
  portions: any[];
  dialogRef: any;
  /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     */
  constructor(
    private _formBuilder: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private odataFactory: ODataServiceFactory,
    public _matDialog: MatDialog
  ) {
    this.curr_year = (new Date()).getFullYear();
    this.curr_crop_year = this.curr_year + '/' + (this.curr_year + 1).toString().substring(2, 4);
    // Set the private defaults
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
    });

    this.route.queryParams
      .subscribe(params => {
        //console.log(params); // {order: "popular"}

        this.mode = params.mode;
        console.log(this.mode); // popular
      });
    this.currentUser = JSON.parse(localStorage.getItem('SEScurrentUser'));
    this.user = this.currentUser.user;
    this.odata = this.odataFactory.CreateService<pricing>('ses_pricings');
    this.odataLov = this.odataFactory.CreateService<lov_data>('ses_lov_datas');
    this.odataParty = this.odataFactory.CreateService<party>('ses_parties');
  }

  ngOnInit() {

    this.form = this._formBuilder.group({
      type_of_sugar_id: [{ value: 'sugartype-hiraw', disabled: false }, Validators.required],
      future_market_id: [{ value: 'No.11', disabled: true }, Validators.required],
      buyer_id: ['', Validators.required],
      qty: [0, Validators.required],
      group_factory_id: ['', Validators.required],
      shipment_from: ['', Validators.required],
      shipment_to: ['', Validators.required],
      buyer_contract_no: ['', Validators.required],
      contract_id: [null],
      contract_date: ['', Validators.required],
      premium_cent: [0, Validators.required],
      contract_month_id: ['', Validators.required],
      contract_year: [this.curr_year, Validators.required],
      crop_year: [this.curr_crop_year, Validators.required],
      contract_made_on_id: ['', Validators.required],
      portion_id: ['', Validators.required],
      remark: ['']
    });

    combineLatest(
      this.odataLov
        .Query()
        .Exec(),
      this.odataParty
        .Query()
        .Filter("record_status eq true")
        .Exec()
    ).subscribe(T => {
      this.allLOVs = T[0];
      this.allPartys = T[1];

      this.groupfactorys = _.orderBy(_.filter(this.allLOVs, function (o) {
        return o.lov_group == 'SYSTEM' && o.lov_type == 'Group Factory' && o.lov2
      }), 'lov1');

      this.buyers = _.orderBy(_.filter(this.allPartys, function (o) {
        return o.record_status == true && o.party_type.indexOf('buyer') > -1
      }), 'party_name');

      this.sugar_types = _.sortBy(_.filter(this.allLOVs, x => x.lov_group.toUpperCase() == 'SYSTEM' && x.lov_type.toUpperCase() == 'SUGAR TYPE' && x.record_status && x.lov3 == 'raw'), "lov_order");

      this.contract_months = _.sortBy(_.filter(this.allLOVs, x => x.lov_group.toUpperCase() == 'SYSTEM' && x.lov_type.toUpperCase() == 'FUTURE MARKET MONTH' && x.record_status && x.lov_code == 'No.11'), "lov_order");

      this.contract_made_ons = _.sortBy(_.filter(this.allLOVs, x => x.lov_group.toUpperCase() == 'SYSTEM' && x.lov_type.toUpperCase() == 'CONTRACT MADE ON' && x.record_status && x.lov3 == 'Y'), "lov_order");

      this.portions = _.sortBy(_.filter(this.allLOVs, x => x.lov_group.toUpperCase() == 'SYSTEM' && x.lov_type.toUpperCase() == 'PRICING PORTION' && x.record_status), "lov_order");

      this.contract_years = [];
      this.crop_years = [];

      for (let i = -2; i < 3; i++) {
        this.contract_years.push(this.curr_year + i);
        var year_crop = this.curr_year + i + '/' + (this.curr_year + i + 1).toString().substring(2, 4);
        var member = {
          id: this.curr_year + i + 1,
          lov1: year_crop
        }
        this.crop_years.push(member);
      }


    }, (error) => {
      if (error.status == 401) {
        this.router.navigate(['/login'], { queryParams: { error: 'Session Expire!' } });
        console.log('Session Expire!');
      } else if (error.status != 401 && error.status != 0) {
        let detail = "";
        detail = error.error.error.message;
        if (error.error.InnerException) {
          detail += '\n' + error.error.InnerException.ExceptionMessage;
        }
        //this.msgs = { severity: 'error', summary: 'Error', detail: detail };
      } else if (error.status == 0) {
        //this.msgs = { severity: 'error', summary: 'Error', detail: 'Cannot connect to server. Please contact administrator.' };
      }

      console.log('ODataExecReturnType.PagedResult ERROR ' + JSON.stringify(error));
    });
  }

  goBack(): void {
    this.location.back();
  }

  addPricing() {
    const data: pricing = this.form.getRawValue();
    data.id = UUID.UUID();
    data.type_of_sugar = null;
    data.qty = Number(data.qty);
    data.premium_cent = Number(data.premium_cent)
    data.future_market = null;
    data.future_market_id = "fmkt-no11";
    data.buyer = null;
    data.contract_month = null;
    data.contract_made_on = null;
    data.portion = null;
    data.pricing_template_id = 'prtemp-raw';
    data.pricing_template = null;
    data.created_date = moment().toDate();
    data.created_by_id = this.user.employee_username;
    this.odata.Post(
      data
    ).Exec()
      .subscribe(
        resolve => {

          // Change the location with new one
          this.router.navigate(['/pricing-hi-raw']);
        }, (error) => {
          if (error.status == 401) {
            this.router.navigate(['/login'], { queryParams: { error: 'Session Expire!' } });
            console.log('Session Expire!');
          } else if (error.status != 401 && error.status != 0) {
            let detail = "";
            detail = error.error.error.message;
            if (error.error.InnerException) {
              detail += '\n' + error.error.InnerException.ExceptionMessage;
            }
            if (error.error.error.innererror) {
              detail += '\n' + error.error.innererrpr.message;
            }

            //this.msgs = { severity: 'error', summary: 'Error', detail: detail };
          } else if (error.status == 0) {

            //this.msgs = { severity: 'error', summary: 'Error', detail: 'Cannot connect to server. Please contact administrator.' };
          }

          console.log('ODataExecReturnType.PagedResult ERROR ' + JSON.stringify(error));
        });

  }

  newPrice(): void {
    this.dialogRef = this._matDialog.open(PricingTransFormComponent, {
      panelClass: 'pricing-trans-form-dialog',
      data: {
        contact: 'contact',
        action: 'edit'
      }
    });
  }

}
