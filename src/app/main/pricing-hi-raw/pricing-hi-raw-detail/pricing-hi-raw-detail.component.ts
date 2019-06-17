import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';
import { ODataConfiguration, ODataExecReturnType, ODataPagedResult, ODataQuery, ODataService, ODataServiceFactory } from 'angular-odata-es5'

import { ODataConfigurationFactory } from '../../../ODataConfigurationFactory';
import { Router, ActivatedRoute } from '@angular/router';
import { pricing } from 'app/shared/models/pricing';
import { UUID } from 'angular2-uuid';
import * as moment from 'moment';



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

    this.odata = this.odataFactory.CreateService<pricing>('ses_pricings');

  }

  ngOnInit() {
    this.form = this._formBuilder.group({
      buyer: [''],
      groupfactory: [''],
      buyercontractno: [''],
      contarctno: ['']
    });
  }

  goBack(): void {
    this.location.back();
  }

  addPricing() {
    const data = new pricing();
    data.id = UUID.UUID();
    data.type_of_sugar = null;
    data.type_of_sugar_id = "sugartype-hiraw";
    // data.future_market = null;
    // data.future_market_id = "No.11";
    data.buyer = null;
    data.buyer_id = "2";
    data.created_date = moment().toDate();
    console.log(data);
    // data.created_date = moment().toDate();
    // data.created_by_id = this.user.employee_username;
    // data.contract_ver = data.contract_ver + 1;
    // data.total_qty = this.calQty();
    // data.total_shipment = this.calShipment();
    // data.contract_items = _.cloneDeep(this.allContract_items);

    // for (let item of data.contract_items) {
    //   item.id = UUID.UUID();
    //   item.contract_id = data.id;
    //   item.product = null;
    //   item.pu_code = null;
    //   item.unit_name_eng = null;
    //   item.pu_sub_code = null;
    //   item.price_type = null;
    // }
    // data.handle = FuseUtils.handleize(data.name);
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
