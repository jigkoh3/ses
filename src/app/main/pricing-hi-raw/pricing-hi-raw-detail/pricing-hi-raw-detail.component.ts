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
import { pricing_tran } from 'app/shared';



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

  displayedColumns: string[] = ['order_date', 'sell_lots', 'buy_lots', 'future_market', 'ag_month_id', 'ag_year', 'priced', 'execute_on', 'star'];
  dataSource = new Array<pricing_tran>();
  sub: any;
  id: any;
  mode: any;
  odata: ODataService<pricing>;
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
  curr_crop_year: number;
  contract_made_ons: any[];
  portions: any[];
  dialogRef: any;


  data: pricing
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
    this.curr_crop_year = this.curr_year + 1;
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

    this.data = new pricing();
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
      buyer_id: [this.data.buyer_id, Validators.required],
      qty: [this.data.qty || 0, Validators.required],
      group_factory_id: [this.data.group_factory_id, Validators.required],
      shipment_from: [this.data.shipment_from, Validators.required],
      shipment_to: [this.data.shipment_to, Validators.required],
      buyer_contract_no: [this.data.buyer_contract_no, Validators.required],
      contract_id: [this.data.contract_id],
      contract_date: [this.data.contract_date, Validators.required],
      premium_cent: [this.data.premium_cent || 0, Validators.required],
      contract_month_id: [this.data.contract_month_id, Validators.required],
      contract_year: [this.curr_year, Validators.required],
      crop_year: [this.data.crop_year || this.curr_crop_year, Validators.required],
      contract_made_on_id: [this.data.contract_made_on_id, Validators.required],
      portion_id: [this.data.portion_id, Validators.required],
      remark: [this.data.remark]
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
        detail = error.error.message;
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
    this.data = this.form.getRawValue();
    this.data.id = UUID.UUID();
    this.data.type_of_sugar = null;
    this.data.qty = Number(this.data.qty);
    this.data.premium_cent = Number(this.data.premium_cent)
    this.data.future_market = null;
    this.data.future_market_id = "fmkt-no11";
    this.data.buyer = null;
    this.data.contract_month = null;
    this.data.contract_made_on = null;
    this.data.portion = null;
    this.data.pricing_template_id = 'prtemp-raw';
    this.data.pricing_template = null;
    this.data.created_date = moment().toDate();
    this.data.created_by_id = this.user.employee_username;
    this.odata.Post(
      this.data
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
            detail = error.error.message;
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

  newPrice(): void {
    this.dialogRef = this._matDialog.open(PricingTransFormComponent, {
      panelClass: 'pricing-trans-form-dialog',
      data: {
        teans: {},
        contract_months: this.contract_months,
        contract_years: this.contract_years,
        action: 'add'
      }
    });

    this.dialogRef.afterClosed()
            .subscribe(response => {
                if ( !response )
                {
                    return;
                }
                
                var trans = response.getRawValue();
                this.dataSource.push(trans);
               console.log(this.dataSource);
            });
  }

}
