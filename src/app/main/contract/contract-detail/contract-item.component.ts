import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MatTab, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ODataConfiguration, ODataServiceFactory, ODataService } from 'angular-odata-es5';
import { ODataConfigurationFactory } from 'app/ODataConfigurationFactory';

import { combineLatest } from 'rxjs';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Sort } from '@angular/material/sort';
import { product, lov_data, packing_unit, pu_sub_code, contract, contract_item, unit_code, shipment_term } from 'app/shared';
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
  contract_item: contract_item;
  shipment_by;
  contract_made_on: lov_data;
  shipment_option;
  shipment_period_from;
  shipment_period_to;
  suger_type: lov_data;
  shipment_term: shipment_term;

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

    let disabledControl: Boolean;
    if (this.mode == 'View') {
      disabledControl = true;
    } else {
      disabledControl = false;
    }

    this.form = this.formBuilder.group({
      id: null,
      item_no: null,
      product_id: [{ value: '', disabled: disabledControl }, Validators.required],
      crop_year_type: [{ value: '', disabled: disabledControl }, Validators.required],
      crop_year_input: [{ value: '', disabled: disabledControl }],
      crop_year: [{ value: '', disabled: disabledControl }, Validators.required],
      min_pola: [{ value: '', disabled: disabledControl }, Validators.required],
      max_moisture: [{ value: '', disabled: disabledControl }, Validators.required],
      min_colour: [{ value: '', disabled: disabledControl }, Validators.required],
      max_colour: [{ value: '', disabled: disabledControl }, Validators.required],
      adm_final_price: null,
      apply_licenses_flag: [{ value: '', disabled: disabledControl }],
      qty: [{ value: '', disabled: disabledControl }, Validators.required],
      qty_tcsc_us: [{ value: 0, disabled: disabledControl }, Validators.required],
      shipment_qty: [{ value: '', disabled: true }],
      pu_code_id: [{ value: '', disabled: disabledControl }, Validators.required],
      packing_qty: [{ value: '', disabled: disabledControl }, Validators.required],
      unit_name_eng_id: [{ value: '', disabled: disabledControl }, Validators.required],
      pu_sub_code_id: [{ value: '', disabled: disabledControl }, Validators.required],
      shipment_period_from: [{ value: '', disabled: disabledControl }, Validators.required],
      shipment_period_to: [{ value: '', disabled: disabledControl }, Validators.required],
      shipment_option: [{ value: '', disabled: disabledControl }, Validators.required],
      price_type_id: [{ value: '', disabled: disabledControl }, Validators.required],
      sugar_cost: [{ value: 0, disabled: true }, Validators.required],
      packing_cost: [{ value: 0, disabled: true }, Validators.required],
      unt_price: [{ value: 0, disabled: true }, Validators.required],
      insurance_cost: [{ value: 0, disabled: true }, Validators.required],
      freight_cost: [{ value: 0, disabled: true }, Validators.required],
      net_price: [{ value: 0, disabled: true }, Validators.required],
      price_desc: [{ value: '', disabled: disabledControl }],
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

    //attachEvent()
    this.form.get('price_type_id')
      .valueChanges
      .subscribe((res) => {
        this.changePriceType(res)
      });

    this.form.get('pu_code_id')
      .valueChanges
      .subscribe((res) => {
        this.changePuCodeId(res)
        this.calPackingQty()
      });

    this.form.get('qty')
      .valueChanges
      .subscribe((res) => {
        this.calPackingQty()
      });

  }

  ngOnInit() {

    for (let i = moment().year() - 2; i <= moment().year() + 2; i++) {
      this.crop_years.push(this.genCropYear(i));
    }

    this.mode = this.data.mode;
    this.id = (this.data.id ? this.data.id.toString() : this.data.id);
    this.contract_item = this.data.contract_item;
    this.currencyText = this.data.currency.cur_code;
    this.shipment_by = this.data.shipment_by;
    this.contract_made_on = this.data.contract_made_on;
    this.shipment_option = this.data.shipment_option;
    this.shipment_period_from = this.data.shipment_period_from;
    this.shipment_period_to = this.data.shipment_period_to;
    this.suger_type = this.data.suger_type;
    this.shipment_term = this.data.shipment_term;



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

    if (this.contract_made_on.lov_code.toUpperCase() == "TCSC" || this.contract_made_on.lov_code.toUpperCase() == "US") {
      this.form.get('qty_tcsc_us').enable();
      this.form.get('qty_tcsc_us').setValue(null);
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
        .Filter("sugar_type_id eq '" + this.suger_type.id + "'and record_status eq true")
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

      //this.id = "1";
      if (this.contract_item) {
        this.form.patchValue({
          product_id: this.contract_item.product_id,
          crop_year_type: this.contract_item.crop_year_type,
          crop_year_input: this.contract_item.crop_year_input,
          crop_year: this.contract_item.crop_year,
          min_pola: this.contract_item.min_pola,
          max_moisture: this.contract_item.max_moisture,
          min_colour: this.contract_item.min_colour,
          max_colour: this.contract_item.max_colour,
          apply_licenses_flag: this.contract_item.apply_licenses_flag,
          qty: this.contract_item.qty,
          qty_tcsc_us: this.contract_item.qty_tcsc_us,
          pu_code_id: this.contract_item.pu_code_id,
          packing_qty: this.contract_item.packing_qty,
          unit_name_eng_id: this.contract_item.unit_name_eng_id,
          pu_sub_code_id: this.contract_item.pu_sub_code_id,
          shipment_period_from: this.contract_item.shipment_period_from,
          shipment_period_to: this.contract_item.shipment_period_to,
          shipment_option: this.contract_item.shipment_option,
          price_type_id: this.contract_item.price_type_id,
          sugar_cost: this.contract_item.sugar_cost,
          packing_cost: this.contract_item.packing_cost,
          unt_price: this.contract_item.unt_price,
          insurance_cost: this.contract_item.insurance_cost,
          freight_cost: this.contract_item.freight_cost,
          net_price: this.contract_item.net_price,
          price_desc: this.contract_item.price_desc,
        });

        this.changePriceType(this.contract_item.price_type_id);

        let packingUnit = _.find(this.packing_units, x => x.id == this.contract_item.pu_code_id);
        if (packingUnit) {
          if (packingUnit.bulk_pack == 'P') {
            if (packingUnit.unit_code) {
              this.unitText = packingUnit.unit_code.name_en;
            }

            if (packingUnit.net_weight) {
              this.form.get('shipment_qty').setValue(this.contract_item.qty * 100 / packingUnit.net_weight)
            }
          }
        }
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

  calPackingQty() {
    if (this.form.get('pu_code_id').value && this.form.get('qty').value) {
      let packing_units = _.find(this.packing_units, x => x.id == this.form.get('pu_code_id').value)

      this.form.get('pu_code_id').setValue(this.form.get('qty').value * 1000 / packing_units.net_weight)
    }
  }

  changePuCodeId(val) {
    let packing_unit = _.find(this.packing_units, x => x.id == val);

    if (packing_unit) {
      this.unitText = packing_unit.unit_code.name_en;
    }
  };

  changePriceType(val) {
    let price_type = _.find(this.price_types, x => x.id == val);
    switch (price_type.lov_code) {
      case "1": {
        this.form.get('sugar_cost').disable();
        this.form.get('packing_cost').disable();
        this.form.get('unt_price').disable();
        this.form.get('insurance_cost').disable();
        this.form.get('freight_cost').disable();

        this.form.patchValue({
          sugar_cost: 0,
          packing_cost: 0,
          unt_price: 0,
          insurance_cost: 0,
          freight_cost: 0,
          net_price: 0,
        });
        break;
      }
      case "2": {
        if (this.shipment_term.shipterm_code == 'FOB') {
          this.form.get('sugar_cost').enable();
          this.form.get('packing_cost').enable();

          this.form.get('unt_price').disable();
          this.form.get('insurance_cost').disable();
          this.form.get('freight_cost').disable();

          this.form.get('unt_price').setValue(0);
          this.form.get('insurance_cost').setValue(0);
          this.form.get('freight_cost').setValue(0);

        } else if (this.shipment_term.shipterm_code == 'CIF') {
          this.form.get('sugar_cost').enable();
          this.form.get('packing_cost').enable();

          this.form.get('unt_price').enable();
          this.form.get('insurance_cost').enable();
          this.form.get('freight_cost').enable();
        } else if (this.shipment_term.shipterm_code == 'CNF') {
          this.form.get('sugar_cost').enable();
          this.form.get('packing_cost').enable();
          this.form.get('unt_price').enable();
          this.form.get('freight_cost').enable();

          this.form.get('insurance_cost').disable();
          this.form.get('insurance_cost').setValue(0);
        } else {
          this.form.get('sugar_cost').disable();
          this.form.get('packing_cost').disable();
          this.form.get('unt_price').disable();
          this.form.get('insurance_cost').disable();
          this.form.get('freight_cost').disable();
          this.form.patchValue({
            sugar_cost: 0,
            packing_cost: 0,
            unt_price: 0,
            insurance_cost: 0,
            freight_cost: 0,
            net_price: 0,
          });
        }
        break;
      }
      case "3": {
        if (this.shipment_term.shipterm_code == 'FOB') {
          this.form.get('sugar_cost').enable();
          this.form.get('packing_cost').enable();

          this.form.get('unt_price').disable();
          this.form.get('insurance_cost').disable();
          this.form.get('freight_cost').disable();

          this.form.get('unt_price').setValue(0);
          this.form.get('insurance_cost').setValue(0);
          this.form.get('freight_cost').setValue(0);

        } else if (this.shipment_term.shipterm_code == 'CIF') {
          this.form.get('sugar_cost').enable();
          this.form.get('packing_cost').enable();

          this.form.get('unt_price').enable();
          this.form.get('insurance_cost').enable();
          this.form.get('freight_cost').enable();
        } else if (this.shipment_term.shipterm_code == 'CNF') {
          this.form.get('sugar_cost').enable();
          this.form.get('packing_cost').enable();
          this.form.get('unt_price').enable();
          this.form.get('freight_cost').enable();

          this.form.get('insurance_cost').disable();
          this.form.get('insurance_cost').setValue(0);
        } else {
          this.form.get('sugar_cost').disable();
          this.form.get('packing_cost').disable();
          this.form.get('unt_price').disable();
          this.form.get('insurance_cost').disable();
          this.form.get('freight_cost').disable();
          this.form.patchValue({
            sugar_cost: 0,
            packing_cost: 0,
            unt_price: 0,
            insurance_cost: 0,
            freight_cost: 0,
            net_price: 0,
          });
        }
        break;
      }
      default: {
        //this.form.get('net_price').disable();
        this.form.get('sugar_cost').disable();
        this.form.get('packing_cost').disable();
        this.form.get('unt_price').disable();
        this.form.get('insurance_cost').disable();
        this.form.get('freight_cost').disable();
        this.form.patchValue({
          sugar_cost: 0,
          packing_cost: 0,
          unt_price: 0,
          insurance_cost: 0,
          freight_cost: 0,
          net_price: 0,
        });
        break;
      }
    }


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