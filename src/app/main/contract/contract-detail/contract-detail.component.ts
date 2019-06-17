import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ODataConfiguration, ODataExecReturnType, ODataPagedResult, ODataQuery, ODataService, ODataServiceFactory } from 'angular-odata-es5'
import { contract, lov_data, party, shipment_to, payment_term, currency, term_cond, packing_unit, unit_code, pu_sub_code, product, shipment_term, contract_item, MasterService } from 'app/shared';
import { combineLatest } from 'rxjs';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ODataConfigurationFactory } from 'app/ODataConfigurationFactory';
import { expand } from 'rxjs/operators';
import { ContractItemComponent } from './contract-item.component';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import 'rxjs/add/operator/filter';
import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import { UUID } from 'angular2-uuid';
@Component({
  selector: 'app-contract-detail',
  templateUrl: './contract-detail.component.html',
  styleUrls: ['./contract-detail.component.scss'],
  animations: fuseAnimations,
  providers: [MasterService, { provide: ODataConfiguration, useFactory: ODataConfigurationFactory }, ODataServiceFactory],
})
export class ContractDetailComponent implements OnInit {
  contractItemDialogRef: MatDialogRef<ContractItemComponent>;


  mode: string;
  user;
  currentUser;
  form: FormGroup;
  formDetail: FormGroup;
  id: string;
  sub: any;

  selectedCurrency;
  //selectedUnit;
  selectedShipmentBy;
  selectedContractMadeOn;
  selectedShipmentOption;
  selectedShipmentPeriodFrom;
  selectedShipmentPeriodTo;

  contract: contract;
  allContract_items: contract_item[];
  contract_items: contract_item[];

  odata: ODataService<contract>;
  odataLov: ODataService<lov_data>;
  odataParty: ODataService<party>;
  odataShipmentTerm: ODataService<shipment_term>;
  odataShipmentTo: ODataService<shipment_to>;
  odataPaymentTerm: ODataService<payment_term>;
  odataCurrency: ODataService<currency>;
  odataTermCond: ODataService<term_cond>;
  odataPackingUnit: ODataService<packing_unit>;
  odataUnitCode: ODataService<unit_code>;
  odataPUSubCode: ODataService<pu_sub_code>;
  odataProduct: ODataService<product>;

  allLovs: lov_data[];
  sugar_types: lov_data[];
  contract_made_ons: lov_data[];
  group_factories: lov_data[];
  partial_shipment_options: lov_data[];

  // contract_statuses= [{ value: "DRAFT", text: "DRAFT" }, { value: "SUBMIT", text: "SUBMIT" }];
  crop_years = [];
  allPartys: party[];
  buyers: any[];
  sellers: any[];

  AllTerm_conds: term_cond[];
  term_conds: any[];

  shipment_terms: shipment_term[];
  shipment_tos: shipment_to[];
  payment_terms: payment_term[];
  currencies: currency[];

  packing_units: packing_unit[];
  unit_codes: unit_code[];
  puSub_codes: pu_sub_code[];
  products: product[];

  //B=BUYER OPTION, S=SELLER OPTION
  shipment_options = [{ value: "B", text: "BUYER OPTION" }, { value: "S", text: "SELLER OPTION" }];

  //C=contract,P=product  (ถ้ามีค่า = contract ให้ copy shipment from ,to ไปที่ ตาราง product(P3))
  shipment_bys = [{ value: "C", text: "CONTRACT" }, { value: "P", text: "PRODUCT" }];

  transactions: any = [
    //{
    // no: '1',
    // productName: 'REFINED SUGAR',
    // Quantity: '12000.00',
    // packingUnit: '1BAG x 50KG',
    // packingQty: '240000.00',
    // unit: 'BAG',
    // shipmentPeriod: '20/02/2018 - 20/05/2018',
    // priceType: 'provisional price',
    // sugarCost: '12,457.01',
    // packingPost: '318.0000',
    // unitPrice: '12,457.0100'
    //}
  ];
  displayedColumns = [
    'no',
    'product.name_en',
    'qty',
    'pu_code.name_en',
    'packing_qty',
    'unit_name_eng.name_en',
    'shipment_period_from',
    'shipment_period_to',
    'price_type.lov1',
    'sugar_cost',
    'packing_cost',
    'insurance_cost',
    'freight_cost',
    'net_price'
  ];


  constructor(private _formBuilder: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    private odataFactory: ODataServiceFactory,
    private dialog: MatDialog,
    private _matSnackBar: MatSnackBar,
    private masterService: MasterService) {

    this.currentUser = JSON.parse(localStorage.getItem('SEScurrentUser'));
    this.user = this.currentUser.user;
    this.odata = this.odataFactory.CreateService<contract>('ses_contracts');

    this.odataLov = this.odataFactory.CreateService<lov_data>('ses_lov_datas');
    this.odataParty = this.odataFactory.CreateService<party>('ses_parties');
    this.odataShipmentTerm = this.odataFactory.CreateService<shipment_term>('ses_shipment_terms');
    this.odataShipmentTo = this.odataFactory.CreateService<shipment_to>('ses_shipment_tos');
    this.odataPaymentTerm = this.odataFactory.CreateService<payment_term>('ses_payment_terms');
    this.odataCurrency = this.odataFactory.CreateService<currency>('ses_currencies');
    this.odataTermCond = this.odataFactory.CreateService<term_cond>('ses_term_conds');
    this.odataPackingUnit = this.odataFactory.CreateService<packing_unit>('ses_packing_units');
    this.odataUnitCode = this.odataFactory.CreateService<unit_code>('ses_unit_codes');
    this.odataPUSubCode = this.odataFactory.CreateService<pu_sub_code>('ses_pu_sub_codes');
    this.odataProduct = this.odataFactory.CreateService<product>('ses_products');
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
    });

    this.route.queryParams
      .subscribe(params => {
        //console.log(params); // {order: "popular"}

        this.mode = params.mode;
        console.log(this.mode); // popular
      });

    for (let i = moment().year() - 2; i <= moment().year() + 2; i++) {
      this.crop_years.push(this.genCropYear(i));
    }

    //mock id
    this.id = "1";

    let disabledControl: Boolean;
    if (this.mode == "View") {
      disabledControl = true;
    } else {
      disabledControl = false;
    }



    this.form = this._formBuilder.group({
      id: null,
      contract_no: [{ value: '', disabled: true }, Validators.required],
      contract_date: [{ value: '', disabled: disabledControl }, Validators.required],
      contract_type: 'CONTRACT',
      contract_ver: 0,
      latest_flag: true,
      addendum_type: null,
      addendum_no: null,
      addendum_date: null,
      contract_status: [{ value: '', disabled: true }, Validators.required],
      contract_made_on_id: [{ value: '', disabled: disabledControl }, Validators.required],
      crop_year: [{ value: '', disabled: disabledControl }, Validators.required],
      seller_id: [{ value: '', disabled: true }, Validators.required],
      group_factory_id: [{ value: '', disabled: disabledControl }, Validators.required],
      sugar_type_id: [{ value: '', disabled: disabledControl }, Validators.required],
      buyer_contract_no: [{ value: '', disabled: disabledControl }, Validators.required],
      buyer_id: [{ value: '', disabled: disabledControl }, Validators.required],
      shipment_term_id: [{ value: '', disabled: disabledControl }, Validators.required],
      shipment_by: [{ value: '', disabled: disabledControl }, Validators.required],
      shipment_period_from: [{ value: '', disabled: disabledControl }, Validators.required],
      shipment_period_to: [{ value: '', disabled: disabledControl }, Validators.required],
      shipment_option: [{ value: '', disabled: disabledControl }, Validators.required],
      partial_shipment_option_id: [{ value: '', disabled: disabledControl }, Validators.required],
      shipment_to_id: [{ value: '', disabled: disabledControl }, Validators.required],
      payment_term_id: [{ value: '', disabled: disabledControl }, Validators.required],
      currency_id: [{ value: '', disabled: disabledControl }, Validators.required],
      exchange_rate: [{ value: '', disabled: disabledControl }, Validators.required],
      shipment_term_remark: [{ value: '', disabled: disabledControl }, Validators.required],
      product_remark: [{ value: '', disabled: disabledControl }, Validators.required],
      gen_term_condition_id: [{ value: '', disabled: disabledControl }, Validators.required],
      //gen_term_condition_desc: [{ value: '', disabled: true }, Validators.required],
      ad_buyer_contract_no: null,
      ad_buyer: null,
      ad_shipment_term: null,
      ad_shipment_option: null,
      ad_partial_shipment_opt: null,
      ad_shipment_to: null,
      ad_payment_term: null,
      ad_exchange_rate: null,
      ad_shipment_term_remark: null,
      ad_product_remark: null,
      ad_gen_term_condition: null,
      total_qty: 0,
      total_shipment: 0,
      record_status: true,
      created_by_id: null,
      created_date: null,
      updated_by_id: null,
      updated_date: null,
      //contract_items: this._formBuilder.array([]),
    });



    combineLatest(
      this.odataLov
        .Query()
        //.Expand('Processes($expand=ApproveFlow($expand=AFApproveFlowDetails($expand=AFDPosition)),Role)')
        .Filter("record_status eq true")
        .Exec(),
      this.odataParty
        .Query()
        // .Expand(',Role)')
        .Filter("record_status eq true")
        .Exec(),
      this.odataShipmentTerm.Query()
        // .Expand(',Role)')
        .Filter("record_status eq true")
        .Exec(),
      this.odataShipmentTo.Query()
        // .Expand(',Role)')
        .Filter("record_status eq true")
        .Exec(),
      this.odataPaymentTerm.Query()
        // .Expand(',Role)')
        .Filter("record_status eq true")
        .Exec(),
      this.odataCurrency.Query()
        // .Expand(',Role)')
        .Filter("record_status eq true")
        .Exec(),
      this.odataTermCond.Query()
        // .Expand(',Role)')
        .Filter("record_status eq true")
        .Exec(),
      this.odataPackingUnit.Query()
        // .Expand(',Role)')
        .Filter("record_status eq true")
        .Exec(),
      this.odataUnitCode.Query()
        // .Expand(',Role)')
        .Filter("record_status eq true")
        .Exec(),
      this.odataPUSubCode.Query()
        // .Expand(',Role)')
        .Filter("record_status eq true")
        .Exec(),
      this.odataProduct.Query()
        // .Expand(',Role)')
        .Filter("record_status eq true")
        .Exec()
    ).subscribe(T => {
      this.allLovs = T[0];
      this.allPartys = T[1];
      this.shipment_terms = T[2]
      this.shipment_tos = T[3]
      this.payment_terms = T[4]
      this.currencies = T[5]
      this.AllTerm_conds = T[6]
      this.packing_units = T[7]
      this.unit_codes = T[8]
      this.puSub_codes = T[9]
      this.products = T[10]

      //LOV
      this.sugar_types = _.sortBy(_.filter(this.allLovs, x => x.lov_group.toUpperCase() == 'SYSTEM' && x.lov_type.toUpperCase() == 'SUGAR TYPE' && x.record_status), "lov_order");
      this.contract_made_ons = _.sortBy(_.filter(this.allLovs, x => x.lov_group.toUpperCase() == 'SYSTEM' && x.lov_type.toUpperCase() == 'CONTRACT MADE ON' && x.record_status), "lov_order");
      this.group_factories = _.sortBy(_.filter(this.allLovs, x => x.lov_group.toUpperCase() == 'SYSTEM' && x.lov_type.toUpperCase() == 'GROUP FACTORY' && x.record_status), "lov_order");
      this.partial_shipment_options = _.sortBy(_.filter(this.allLovs, x => x.lov_group.toUpperCase() == 'SYSTEM' && x.lov_type.toUpperCase() == 'PARTIAL SHIPMENT OPTION' && x.record_status), "lov_order");

      let defaultSeller = _.find(this.allLovs, x => x.lov_group.toUpperCase() == 'SYSTEM' && x.lov_type.toUpperCase() == 'CONSTANT' && x.lov_code.toUpperCase() == 'DEFAULT SELLER' && x.record_status);
      //Party
      this.buyers = _.sortBy(_.filter(this.allPartys, x => x.party_type.toUpperCase() == 'BUYER' && x.record_status), "party_abbv");



      this.sellers = _.filter(this.allPartys, x => x.id == defaultSeller.lov1 && x.record_status);

      if (this.id) {
        this.odata.Get(this.id)
          .Expand('contract_items($expand=product,pu_code,unit_name_eng,price_type),partial_shipment_option')
          .Exec()
          .subscribe(contract => {
            this.contract = contract;
            this.term_conds = _.filter(this.AllTerm_conds, x => x.partial_shipment_option == contract.partial_shipment_option.lov1)
            this.crop_years.push(this.genCropYear(Number(contract.crop_year)));
            this.crop_years = _.sortBy(_.uniq(this.crop_years), "value");

            this.allContract_items = this.contract.contract_items
            this.contract_items = this.contract.contract_items
            let gen_term_condition: term_cond;
            if (this.contract.gen_term_condition_id) {
              gen_term_condition = _.find(this.AllTerm_conds, x => x.id == this.contract.gen_term_condition_id)
            }

            this.form.patchValue({
              contract_no: this.contract.contract_no,
              contract_status: this.contract.contract_status,
              contract_made_on_id: this.contract.contract_made_on_id,
              crop_year: this.contract.crop_year,
              contract_date: this.contract.contract_date,
              seller_id: this.contract.seller_id,
              group_factory_id: this.contract.group_factory_id,
              sugar_type_id: this.contract.sugar_type_id,
              buyer_contract_no: this.contract.buyer_contract_no,
              buyer_id: this.contract.buyer_id,
              shipment_term_id: this.contract.shipment_term_id,
              shipment_by: this.contract.shipment_by,
              shipment_period_from: this.contract.shipment_period_from,
              shipment_period_to: this.contract.shipment_period_to,
              shipment_option: this.contract.shipment_option,
              partial_shipment_option_id: this.contract.partial_shipment_option_id,
              shipment_to_id: this.contract.shipment_to_id,
              payment_term_id: this.contract.payment_term_id,
              currency_id: this.contract.currency_id,
              exchange_rate: this.contract.exchange_rate,
              shipment_term_remark: this.contract.shipment_term_remark,
              product_remark: this.contract.product_remark,
              gen_term_condition_id: this.contract.gen_term_condition_id,
              gen_term_condition_desc: (gen_term_condition ? gen_term_condition.tc_in_contract : ""),
            });

            this.selectedCurrency = _.find(this.currencies, x => x.id == this.contract.currency_id);
            //this.selectedUnit = _.filter(this.currencies,x=>x.id ==this.contract.currency_id);
            this.selectedShipmentBy = this.contract.shipment_by;
            this.selectedContractMadeOn = _.find(this.contract_made_ons, x => x.id == this.contract.contract_made_on_id);
            this.selectedShipmentOption = this.contract.shipment_option;
            this.selectedShipmentPeriodFrom = this.contract.shipment_period_from;
            this.selectedShipmentPeriodTo = this.contract.shipment_period_to;
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

        // this.form['contract_status'].setValue("DRAFT");

        this.form.patchValue({
          contract_status: 'DRAFT',
          seller_id: defaultSeller.lov1,
        });
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

  changePartialShipmentOption() {
    //where tc.partial_shipment_option like 
  }

  genCropYear(year: number) {
    return { value: year.toString(), text: year - 1 + '/' + year.toString().substr(2, 2) };
  }

  openContractItemDialog(id: string) {
    let mode;
    if (this.mode == 'View') {
      mode = this.mode;
    } else {
      mode = id ? "Edit" : "Add"
    }
    this.contractItemDialogRef = this.dialog.open(ContractItemComponent, {
      height: '80%',
      width: '60%',
      data: {
        id: id,
        mode: mode,
        shipment_by: this.selectedShipmentBy,
        contract_made_on: this.selectedContractMadeOn,
        shipment_option: this.selectedShipmentOption,
        shipment_period_from: this.selectedShipmentPeriodFrom,
        shipment_period_to: this.selectedShipmentPeriodTo,
        //unit: this.selectedUnit,
        currency: this.selectedCurrency
      }
    });

    this.contractItemDialogRef.afterClosed().pipe(
    ).subscribe((ret: contract_item) => {
      if (ret) {
        if (ret.id) {
          let contract_item = _.find(this.allContract_items, x => x.id == ret.id);
          contract_item = ret;
        }
        this._matSnackBar.open('Contract item saved', 'OK', {
          verticalPosition: 'top',
          duration: 10000
        });
      } else {
        this.allContract_items.push(ret);
        this._matSnackBar.open('Contract item added', 'OK', {
          verticalPosition: 'top',
          duration: 10000
        });
      }
      // this.files.push({ name, content: ''});
    })
  }

  genBReq(): Promise<string> {
    let group_factory = _.find(this.group_factories, x => x.id == this.form.controls['group_factory_id'].value);
    let promise: Promise<string> = new Promise((resolve, reject) => {
      this.masterService.getRunning('CONTRACT', group_factory.lov_code).subscribe(val => {
        if (val) {
          resolve(val);
        } else {
          reject();
        }
      })
    });
    return promise;
  }

  calQty() {
    let qty = 0;
    for (let item of this.contract_items) {
      qty += Number(item.qty)
    }
    return qty;
  }

  calShipment() {
    let shipment = 0;
    for (let item of this.contract_items) {
      shipment += Number(item.shipment_qty)
    }
    return shipment;
  }

  addContract() {
    const data: contract = this.form.getRawValue();
    data.id = UUID.UUID();
    data.created_date = moment().toDate();
    data.created_by_id = this.user.employee_username;
    data.contract_ver = data.contract_ver + 1;
    data.total_qty = this.calQty();
    data.total_shipment = this.calShipment();
    data.contract_items = _.cloneDeep(this.allContract_items);

    for (let item of data.contract_items) {
      item.id = UUID.UUID();
      item.contract_id = data.id;
      item.product = null;
      item.pu_code = null;
      item.unit_name_eng = null;
      item.pu_sub_code = null;
      item.price_type = null;
    }
    // data.handle = FuseUtils.handleize(data.name);
    this.genBReq().then(running => {
      data.contract_no = running;
      this.odata.Post(
        data
      ).Exec()
        .subscribe(
          resolve => {
            this._matSnackBar.open('Contract no.' + running + ' added', 'OK', {
              verticalPosition: 'top',
              duration: 10000
            });
            // Change the location with new one
            this.router.navigate(['/contract']);
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
    }).catch(error => {
      this._matSnackBar.open('Cannot generate contract no.', 'ERROR', {
        verticalPosition: 'top',
        duration: 10000
      });


    });
  }

  saveContract() {
    const data: contract = this.form.getRawValue();
    data.id = UUID.UUID();
    data.updated_date = moment().toDate();
    data.updated_by_id = this.user.employee_username;
    data.contract_ver = data.contract_ver + 1;
    data.total_qty = this.calQty();
    data.total_shipment = this.calShipment();

    data.contract_items = _.cloneDeep(this.allContract_items);

    for (let item of data.contract_items) {
      if (!item.id) {
        item.id = UUID.UUID();
        data.created_date = moment().toDate();
        data.created_by_id = this.user.employee_username;
      } else {
        data.updated_date = moment().toDate();
        data.updated_by_id = this.user.employee_username;
      }

      item.contract_id = data.id;
      item.product = null;
      item.pu_code = null;
      item.unit_name_eng = null;
      item.pu_sub_code = null;
      item.price_type = null;


    }
    // data.handle = FuseUtils.handleize(data.name);


    this.odata.Put(
      data,
      this.id
    ).Exec()
      .subscribe(
        resolve => {
          this._matSnackBar.open('Contract no.' + data.contract_no + ' saved', 'OK', {
            verticalPosition: 'top',
            duration: 10000
          });
          // Change the location with new one
          this.router.navigate(['/contract']);
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

}



