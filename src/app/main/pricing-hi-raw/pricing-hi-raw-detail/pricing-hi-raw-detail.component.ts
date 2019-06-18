import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
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
    private odataFactory: ODataServiceFactory
  ) {
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
      contract_id: [''],
      contract_date: ['', Validators.required],
      premium_cent: [0, Validators.required]
    });

    combineLatest(
      this.odataLov
        .Query()
        //.Expand('Processes($expand=ApproveFlow($expand=AFApproveFlowDetails($expand=AFDPosition)),Role)')
        //.Filter("record_status eq true")
        .Exec(),
      this.odataParty
        .Query()
        //.Expand('Processes($expand=ApproveFlow($expand=AFApproveFlowDetails($expand=AFDPosition)),Role)')
        .Filter("record_status eq true")
        .Exec()
    ).subscribe(T => {
      this.allLOVs = T[0];
      this.allPartys = T[1];

      //[lov_code,lov1]+[SYSTEM,Group Factory]+[lov2 is not null]
      this.groupfactorys = _.orderBy(_.filter(this.allLOVs, function (o) {
        return o.lov_group == 'SYSTEM' && o.lov_type == 'Group Factory' && o.lov2
      }), 'lov1');
      console.log(this.groupfactorys)
      //p.record_status = 1 and p.party_type like ‘%buyer%’ order by 2
      this.buyers = _.orderBy(_.filter(this.allPartys, function (o) {
        return o.record_status == true && o.party_type.indexOf('buyer') > -1
      }), 'party_name');

      this.sugar_types = _.sortBy(_.filter(this.allLOVs, x => x.lov_group.toUpperCase() == 'SYSTEM' && x.lov_type.toUpperCase() == 'SUGAR TYPE' && x.record_status && x.lov3 == 'raw'), "lov_order");
      // this.getPagedData();

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
    // const data = new pricing();

    const data: pricing = this.form.getRawValue();
    // console.log(data);

    data.id = UUID.UUID();
    data.type_of_sugar = null;
    data.qty = Number(data.qty );
    data.premium_cent = Number(data.premium_cent )
    data.future_market = null;
    data.future_market_id = "fmkt-no11";
    data.buyer = null;
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

}
