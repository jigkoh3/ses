import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MatTab, MatSnackBar, MAT_DIALOG_DATA, ErrorStateMatcher } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ODataConfiguration, ODataServiceFactory, ODataService } from 'angular-odata-es5';
import { ODataConfigurationFactory } from 'app/ODataConfigurationFactory';

import { combineLatest } from 'rxjs';
import * as _ from 'lodash';
import { Sort } from '@angular/material/sort';
import { product, lov_data, packing_unit, pu_sub_code, contract, contract_item, unit_code, shipment_term } from 'app/shared';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { UUID } from 'angular2-uuid';
import { debounceTime } from 'rxjs/operators';
import * as _moment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
// tslint:disable-next-line:no-duplicate-imports
// import {default as _rollupMoment} from 'moment';

// const moment = _rollupMoment || _moment;
const moment = _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD MMM YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    //console.log(control);
    return control.dirty && (form.errors ? true : false);
  }
}

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
    private _matSnackBar: MatSnackBar,
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
      crop_year_type: [{ value: 'CURRENT', disabled: disabledControl }, Validators.required],
      crop_year_input: [{ value: '', disabled: disabledControl }],
      crop_year: [{ value: null, disabled: disabledControl }, Validators.required],
      min_pola: [{ value: null, disabled: disabledControl }, Validators.required],
      max_moisture: [{ value: null, disabled: disabledControl }, Validators.required],
      min_colour: [{ value: null, disabled: disabledControl }, Validators.required],
      max_colour: [{ value: null, disabled: disabledControl }, Validators.required],
      adm_finalprice_flag: null,

      apply_licenses_flag: [{ value: false, disabled: disabledControl }],
      qty: [{ value: '', disabled: disabledControl }, Validators.required],
      qty_tcsc_us: [{ value: 0, disabled: disabledControl }, Validators.required],
      shipment_qty: [{ value: null, disabled: true }],
      pu_code_id: [{ value: '', disabled: disabledControl }, Validators.required],
      packing_qty: [{ value: null, disabled: true }],
      unit_name_eng_id: [{ value: '', disabled: disabledControl }],
      pu_sub_code_id: [{ value: '', disabled: disabledControl }, Validators.required],
      shipment_period_from: [{ value: '', disabled: disabledControl }, Validators.required],
      shipment_period_to: [{ value: '', disabled: disabledControl }, Validators.required],
      // pricing_method: 3,
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
    }, { validator: this.checkQty });

    //attachEvent()
    this.form.get('product_id')
      .valueChanges
      .subscribe((res) => {
        this.changeProduct(res)
      });

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
      .pipe(debounceTime(400))
      .subscribe((res) => {
        this.calPackingQty()
      });

    this.form.get('crop_year_type')
      .valueChanges
      .pipe(debounceTime(400))
      .subscribe((res) => {
        this.changeCropYearType(res);
      });

    this.form.get('crop_year_input')
      .valueChanges
      .pipe(debounceTime(400))
      .subscribe((res) => {
        this.changeCropYearInput(res);
      });


    this.form.get('crop_year_type')
      .valueChanges
      .pipe()
      .subscribe((res) => {
        this.changeCropYearInput(res);
      });

    this.form.get('sugar_cost')
      .valueChanges
      .pipe(debounceTime(400))
      .subscribe((res) => {
        this.calPrice();
      });

    this.form.get('packing_cost')
      .valueChanges
      .pipe(debounceTime(400))
      .subscribe((res) => {
        this.calPrice();
      });

    this.form.get('insurance_cost')
      .valueChanges
      .pipe(debounceTime(400))
      .subscribe((res) => {
        this.calPrice();
      });

    this.form.get('freight_cost')
      .valueChanges
      .pipe(debounceTime(400))
      .subscribe((res) => {
        this.calPrice();
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
          id: this.contract_item.id,
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
          record_status: this.contract_item.record_status,
          created_by_id: this.contract_item.created_by_id,
          created_date: this.contract_item.created_date,
          updated_by_id: this.contract_item.updated_by_id,
          updated_date: this.contract_item.updated_date,
        });

        this.form.get('product_id').disable;

        this.changePriceType(this.contract_item.price_type_id);
        this.changeCropYearType(this.contract_item.crop_year_type);

        let packingUnit = _.find(this.packing_units, x => x.id == this.contract_item.pu_code_id);
        if (packingUnit) {
          if (packingUnit.bulk_pack == 'P') {
            if (packingUnit.unit_code) {
              this.unitText = packingUnit.unit_code.name_en;
              this.form.get('unit_name_eng_id').setValue(packingUnit.unit_code.id)
            }

            if (packingUnit.net_weight) {
              this.form.get('packing_qty').setValue(this.contract_item.qty * 100 / packingUnit.net_weight)
            }
          }
        }

        if (this.mode == "View") {
          const controls = this.form.controls;
          for (const name in controls) {
            controls[name].disable({ emitEvent: false });
          }
        }
      } else {
        this.changeCropYearType(this.form.get('crop_year_type').value);
      }
    }, (error) => {
      if (error.status == 401) {
        this.router.navigate(['/login'], { queryParams: { error: 'Session Expire!' } });
        this.dialogRef.close();
        console.log('Session Expire!');
      } else if (error.status != 401 && error.status != 0) {
        let detail = "";
        detail = error.error.error.message;
        if (error.error.error.InnerException) {
          detail += '\n' + error.error.error.InnerException.ExceptionMessage;
        }
        if (error.error.error.innererror) {
          detail += '\n' + error.error.error.innererror.message;
        }
        this._matSnackBar.open(detail, 'ERROR', {
          verticalPosition: 'top',
          duration: 10000
        });
        //this.msgs = { severity: 'error', summary: 'Error', detail: detail };
      } else if (error.status == 0) {
        this._matSnackBar.open('Cannot connect to server. Please contact administrator.', 'ERROR', {
          verticalPosition: 'top',
          duration: 10000
        });
        //this.msgs = { severity: 'error', summary: 'Error', detail: 'Cannot connect to server. Please contact administrator.' };
      }

      console.log('ODataExecReturnType.PagedResult ERROR ' + JSON.stringify(error));
    });
  }

  findInvalidControls() {
    const invalid = [];
    const controls = this.form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        console.log(name);
      }
    }
  }

  checkQty(group: FormGroup) {
    if (group.controls.qty.value && group.controls.shipment_qty.value) {
      if (group.controls.shipment_qty.value > group.controls.qty.value) {
        return { notValid: true }
      }
    }
    return null;
  }

  calPackingQty() {
    if (this.form.get('pu_code_id').value && this.form.get('qty').value) {
      let packing_unit = _.find(this.packing_units, x => x.id == this.form.get('pu_code_id').value)

      if (packing_unit.bulk_pack == 'P') {
        this.form.get('unit_name_eng_id').setValue(packing_unit.unit_id);
        this.unitText = packing_unit.unit_code.name_en;
        this.form.get('packing_qty').setValue(this.form.get('qty').value * 1000 / packing_unit.net_weight)
      } else {
        this.form.get('unit_name_eng_id').setValue(null);
        this.form.get('packing_qty').setValue(null);
        this.unitText = null;
      }
    } else {
      this.form.get('unit_name_eng_id').setValue(null);
      this.form.get('packing_qty').setValue(null);
      this.unitText = null;
    }
  }

  changeCropYearType(val) {
    if (val == "CURRENT") {
      this.form.get('crop_year_input').disable();
      this.form.get('crop_year_input').setValue(null);

      // Current date > 01/12/2018 = 2018/19,Current date < 01/12/2018 = 2017/18
      let crop_year = ""
      if (moment() > moment('0112' + moment().year(), 'ddmmyyyy')) {
        crop_year = moment().year().toString() + '/' + moment().add(1, 'year').year().toString().substr(2, 2);
        this.form.get('crop_year').setValue(crop_year);
      } else {
        crop_year = moment().add(1, 'year').year().toString() + '/' + moment().add(1, 'year').year().toString().substr(2, 2);
        this.form.get('crop_year').setValue(crop_year)
      }
    } else {
      this.form.get('crop_year_input').enable();
      this.form.get('crop_year_input').setValue(null);
      this.form.get('crop_year_input').setValue(null)
    }
  }

  changeCropYearInput(val) {
    if (val) {
      this.form.get('crop_year').setValue(val);
    }
  }
  changePuCodeId(val) {
    let packing_unit = _.find(this.packing_units, x => x.id == val);

    if (packing_unit) {
      this.unitText = packing_unit.unit_code.name_en;
      this.form.get('unit_name_eng_id').setValue(packing_unit.unit_code.id);
      //this.form.get('unit_name_eng').setValue(packing_unit.unit_code);
    }
  };

  changeProduct(val) {
    if (val) {
      let product = _.find(this.products, x => x.id == val);
      this.form.get('apply_licenses_flag').setValue(product.apply_licenses_flag);
    } else {
      this.form.get('apply_licenses_flag').setValue(null);
    }
  }

  changePriceType(val) {
    let price_type = _.find(this.price_types, x => x.id == val);
    if (price_type) {
      switch (price_type.lov_code) {
        case "1": {
          this.form.get('sugar_cost').disable();
          this.form.get('packing_cost').disable();
          // this.form.get('unt_price').disable();
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

            // this.form.get('unt_price').disable();
            this.form.get('insurance_cost').disable();
            this.form.get('freight_cost').disable();

            this.form.get('unt_price').setValue(0);
            this.form.get('insurance_cost').setValue(0);
            this.form.get('freight_cost').setValue(0);

          } else if (this.shipment_term.shipterm_code == 'CIF') {
            this.form.get('sugar_cost').enable();
            this.form.get('packing_cost').enable();

            // this.form.get('unt_price').disable();
            this.form.get('insurance_cost').enable();
            this.form.get('freight_cost').enable();
          } else if (this.shipment_term.shipterm_code == 'CNF') {
            this.form.get('sugar_cost').enable();
            this.form.get('packing_cost').enable();
            // this.form.get('unt_price').disable();
            this.form.get('freight_cost').enable();

            this.form.get('insurance_cost').disable();
            this.form.get('insurance_cost').setValue(0);
          } else {
            this.form.get('sugar_cost').disable();
            this.form.get('packing_cost').disable();
            // this.form.get('unt_price').disable();
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
            this.form.patchValue({
              sugar_cost: null,
              packing_cost: null,
            });

            // this.form.get('unt_price').disable();
            this.form.get('insurance_cost').disable();
            this.form.get('freight_cost').disable();

            this.form.get('unt_price').setValue(0);
            this.form.get('insurance_cost').setValue(0);
            this.form.get('freight_cost').setValue(0);

          } else if (this.shipment_term.shipterm_code == 'CIF') {
            this.form.get('sugar_cost').enable();
            this.form.get('packing_cost').enable();
            // this.form.get('unt_price').enable();
            this.form.get('insurance_cost').enable();
            this.form.get('freight_cost').enable();

            this.form.patchValue({
              sugar_cost: null,
              packing_cost: null,
              unt_price: null,
              insurance_cost: null,
              freight_cost: null,
            });
          } else if (this.shipment_term.shipterm_code == 'CNF') {
            this.form.get('sugar_cost').enable();
            this.form.get('packing_cost').enable();
            // this.form.get('unt_price').disable();
            this.form.get('freight_cost').enable();

            this.form.patchValue({
              sugar_cost: null,
              packing_cost: null,
              unt_price: null,
              freight_cost: null,
            });

            this.form.get('insurance_cost').disable();
            this.form.get('insurance_cost').setValue(0);
          } else {
            this.form.get('sugar_cost').disable();
            this.form.get('packing_cost').disable();
            // this.form.get('unt_price').disable();
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
          // this.form.get('unt_price').disable();
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
  }

  calPrice() {
    let sugar_cost = Number(this.form.get('sugar_cost').value);
    let packing_cost = Number(this.form.get('packing_cost').value);
    let insurance_cost = Number(this.form.get('insurance_cost').value);
    let freight_cost = Number(this.form.get('freight_cost').value);
    let uni_price = sugar_cost + packing_cost + insurance_cost + freight_cost
    let total = sugar_cost + packing_cost + insurance_cost + freight_cost;
    this.form.get('unt_price').setValue(uni_price);
    this.form.get('net_price').setValue(total);
  }

  genCropYear(year: number) {
    return { value: year.toString(), text: year - 1 + '/' + year.toString().substr(2, 2) };
  }

  saveProduct(form) {
    const data: contract_item = this.form.getRawValue();


    data.product = _.find(this.products, x => x.id == data.product_id);
    data.pu_code = _.find(this.packing_units, x => x.id == data.pu_code_id);
    let packing_unit = _.find(this.packing_units, x => x.id == data.pu_code_id);
    data.unit_name_eng = packing_unit.unit_code;
    data.pu_sub_code = _.find(this.pu_sub_codes, x => x.id == data.pu_sub_code_id);
    data.price_type = _.find(this.price_types, x => x.id == data.price_type_id);
    //data.partial_shipment_option= _.find(this.partial_shipment_options,x=>x.id == data.partial_shipment_option);
    this.dialogRef.close(data);
  }

  closeProduct() {
    this.dialogRef.close();
  }
}