import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MatTab, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ODataConfiguration, ODataServiceFactory, ODataService } from 'angular-odata-es5';
import { ODataConfigurationFactory } from 'app/ODataConfigurationFactory';

import { combineLatest } from 'rxjs';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Sort } from '@angular/material/sort';
import { product, lov_data, packing_unit, pu_sub_code, contract, contract_item, unit_code } from 'app/shared';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'app-contract-item',
  templateUrl: './contract-item.component.html',
  styleUrls: ['./contract-item.component.scss'],
  animations: fuseAnimations,
  providers: [{ provide: ODataConfiguration, useFactory: ODataConfigurationFactory }, ODataServiceFactory],
})

export class ContractItemComponent implements OnInit {
  currentUser;
  user;
  mode;
  form: FormGroup;
  id: string;
  crop_years = [];
  unitText = "";
  currencyText = "";
  shipment_by;
  contract_made_on;
  shipment_option;
  shipment_period_from;
  shipment_period_to;

  odata: ODataService<contract_item>;
  odataLov: ODataService<lov_data>;
  odataProduct: ODataService<product>;
  odataPackingUnit: ODataService<packing_unit>;
  odataPUSubCode: ODataService<pu_sub_code>;
  //odataUnitCode: ODataService<unit_code>;

  allLovs: lov_data[];
  price_types: lov_data[];

  products: product[];
  packing_units: packing_unit[];
  pu_sub_codes: pu_sub_code[];

  shipment_options = [{ value: "B", text: "BUYER OPTION" }, { value: "S", text: "SELLER OPTION" }];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ContractItemComponent>,
    private odataFactory: ODataServiceFactory,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.currentUser = JSON.parse(localStorage.getItem('SEScurrentUser'));
    this.user = this.currentUser.user;
    this.odata = this.odataFactory.CreateService<contract_item>('ses_contract_items');
    this.odataLov = this.odataFactory.CreateService<lov_data>('ses_lov_datas');
    this.odataProduct = this.odataFactory.CreateService<product>('ses_products');
    this.odataPackingUnit = this.odataFactory.CreateService<packing_unit>('ses_packing_units');
    this.odataPUSubCode = this.odataFactory.CreateService<pu_sub_code>('ses_pu_sub_codes');
    //this.odataUnitCode = this.odataFactory.CreateService<unit_code>('ses_unit_codes');
  }

  ngOnInit() {

    for (let i = moment().year() - 2; i <= moment().year() + 2; i++) {
      this.crop_years.push(this.genCropYear(i));
    }
    this.mode = this.data.mode;
    this.id = this.data.id;
    this.currencyText = this.data.currency.cur_code;
    this.shipment_by = this.data.shipment_by;
    this.contract_made_on = this.data.contract_made_on;
    this.shipment_option = this.data.shipment_option;
    this.shipment_period_from = this.data.shipment_period_from;
    this.shipment_period_to = this.data.shipment_period_to;

    this.form = this.formBuilder.group({
      id: null,
      item_no: null,
      product_id: [{ value: '', disabled: false }, Validators.required],
      crop_year_type: [{ value: '', disabled: false }, Validators.required],
      crop_year_input: [{ value: '', disabled: false }],
      crop_year: [{ value: '', disabled: false }, Validators.required],
      min_pola: [{ value: '', disabled: false }, Validators.required],
      max_moisture: [{ value: '', disabled: false }, Validators.required],
      min_colour: [{ value: '', disabled: false }, Validators.required],
      max_colour: [{ value: '', disabled: false }, Validators.required],
      adm_final_price: null,
      apply_licenses_flag: [{ value: '', disabled: false }],
      qty: [{ value: '', disabled: false }, Validators.required],
      qty_tcsc_us: [{ value: '', disabled: false }, Validators.required],
      shipment_qty: [{ value: '', disabled: true }],
      pu_code_id: [{ value: '', disabled: false }, Validators.required],
      packing_qty: [{ value: '', disabled: false }, Validators.required],
      unit_name_eng_id: [{ value: '', disabled: false }, Validators.required],
      pu_sub_code_id: [{ value: '', disabled: false }, Validators.required],
      shipment_period_from: [{ value: '', disabled: false }, Validators.required],
      shipment_period_to: [{ value: '', disabled: false }, Validators.required],
      shipment_option: [{ value: '', disabled: false }, Validators.required],
      price_type_id: [{ value: '', disabled: false }, Validators.required],
      sugar_cost: [{ value: '', disabled: false }, Validators.required],
      packing_cost: [{ value: '', disabled: false }, Validators.required],
      unt_price: [{ value: '', disabled: false }, Validators.required],
      insurance_cost: [{ value: '', disabled: false }, Validators.required],
      freight_cost: [{ value: '', disabled: false }, Validators.required],
      net_price: [{ value: '', disabled: false }, Validators.required],
      price_desc: [{ value: '', disabled: false }, Validators.required],
      ad_quality: null,
      ad_quantity: null,
      ad_packing: null,
      ad_shipment: null,
      ad_price: null,
      record_status: true,
      created_by_id: null,
      created_date: null,
      updated_by_id: null,
      updated_date: null,
    });

    if (this.shipment_by == "C") {
      this.form.patchValue({
        shipment_period_from: this.shipment_period_from,
        shipment_period_to: this.shipment_period_to,
        shipment_option: this.shipment_option
      });
      this.form.get('shipment_period_from').disable();
      this.form.get('shipment_period_to').disable();
      this.form.get('shipment_option').disable();
    }

    if (this.contract_made_on.lov_code == "TCSC" || this.contract_made_on.lov_code == "US") {
      this.form.get('qty_tcsc_us').enable();
    } else {
      this.form.get('qty_tcsc_us').disable();
    }

    //product,pu_code,unit_name_eng,pu_sub_code,price_type
    combineLatest(
      this.odataLov
        .Query()
        //.Expand()
        .Filter('record_status eq true')
        .Exec(),
      this.odataProduct
        .Query()
        //.Expand()
        .Filter('record_status eq true')
        .Exec(),
      this.odataPackingUnit
        .Query()
        .Expand('unit_code')
        .Filter('record_status eq true')
        .Exec(),
      this.odataPUSubCode
        .Query()
        //.Expand()
        .Filter('record_status eq true')
        .Exec(),
      // this.odataUnitCode
      //   .Query()
      //   //.Expand()
      //   .Filter('record_status eq true')
      //   .Exec(),
    ).subscribe(T => {
      //mock id
      this.allLovs = T[0];
      this.products = T[1];
      this.packing_units = T[2];
      this.pu_sub_codes = T[3];

      this.price_types = _.sortBy(_.filter(this.allLovs, x => x.lov_group.toUpperCase() == 'SYSTEM' && x.lov_type.toUpperCase() == 'PRICE TYPE' && x.record_status), "lov_order");

      this.id = "1";
      if (this.id) {
        this.odata.Get(this.id)
          .Expand('product,pu_code,unit_name_eng,pu_sub_code,price_type')
          .Exec()
          .subscribe(contract_item => {





            this.form.patchValue({
              product_id: contract_item.product_id,
              crop_year_type: contract_item.crop_year_type,
              crop_year_input: contract_item.crop_year_input,
              crop_year: contract_item.crop_year,
              min_pola: contract_item.min_pola,
              max_moisture: contract_item.max_moisture,
              min_colour: contract_item.min_colour,
              max_colour: contract_item.max_colour,
              apply_licenses_flag: contract_item.apply_licenses_flag,
              qty: contract_item.qty,
              qty_tcsc_us: contract_item.qty_tcsc_us,
              pu_code_id: contract_item.pu_code_id,
              packing_qty: contract_item.packing_qty,
              unit_name_eng_id: contract_item.unit_name_eng_id,
              pu_sub_code_id: contract_item.pu_sub_code_id,
              shipment_period_from: contract_item.shipment_period_from,
              shipment_period_to: contract_item.shipment_period_to,
              shipment_option: contract_item.shipment_option,
              price_type_id: contract_item.price_type_id,
              sugar_cost: contract_item.sugar_cost,
              packing_cost: contract_item.packing_cost,
              unt_price: contract_item.unt_price,
              insurance_cost: contract_item.insurance_cost,
              freight_cost: contract_item.freight_cost,
              net_price: contract_item.net_price,
              price_desc: contract_item.price_desc,
            });

            let packingUnit = _.find(this.packing_units, x => x.id == contract_item.pu_code_id);
            if (packingUnit) {
              if (packingUnit.bulk_pack == 'P') {
                if (packingUnit.unit_code) {
                  this.unitText = packingUnit.unit_code.name_en;
                }

                if (packingUnit.net_weight) {
                  this.form.get('shipment_qty').setValue(contract_item.qty * 100 / packingUnit.net_weight)
                }
              }
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
      } else {

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

  calPrice() {

  }

  genCropYear(year: number) {
    return { value: year.toString(), text: year - 1 + '/' + year.toString().substr(2, 2) };
  }

  saveProduct(form) {
    const data: contract_item = this.form.getRawValue();
    this.dialogRef.close(data);
  }
}