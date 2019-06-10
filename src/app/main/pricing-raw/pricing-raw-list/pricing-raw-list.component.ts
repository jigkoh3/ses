import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as english } from '../i18n/en';
import { locale as turkish } from '../i18n/tr';
import { ODataConfiguration, ODataExecReturnType, ODataPagedResult, ODataQuery, ODataService, ODataServiceFactory } from 'angular-odata-es5'

import { filter, FilterMetadata } from '../../../shared';
import { ODataConfigurationFactory } from '../../../ODataConfigurationFactory';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-pricing-raw-list',
  templateUrl: './pricing-raw-list.component.html',
  styleUrls: ['./pricing-raw-list.component.scss'],
  providers: [{ provide: ODataConfiguration, useFactory: ODataConfigurationFactory }, ODataServiceFactory],
})
export class PricingRawListComponent implements OnInit {
  public count: number = 0;

  public totalRecords: number;

  public filter: filter;

  public query: ODataQuery<any>;

  private odata: ODataService<any>;
  private odataLov: ODataService<any>;
  private odataParty: ODataService<any>;
  //private odataContact: ODataService<any>;
  allLOVs;
  allPartys;
  currentUser;

  total: any;
  lots: any;
  screenwidth: any;
  buyer: any = [
    { value: 'ED & F Man', viewValue: 'ED & F Man' },
    { value: 'Alvean', viewValue: 'Alvean' },
    { value: 'Bunge', viewValue: 'Bunge' },
    { value: 'Itochu', viewValue: 'Itochu' }
  ];
  groupfactory: any = [
    { value: 'TR-กลุ่มไทยรุ่งเรือง', viewValue: 'TR-กลุ่มไทยรุ่งเรือง' },
    // { value: 'TR-กลุ่มไทยรุ่งเรือง', viewValue: 'TR-กลุ่มไทยรุ่งเรือง' },
    // { value: 'pizza-1', viewValue: 'Pizza' },
    // { value: 'tacos-2', viewValue: 'Tacos' }
  ];
  buyercontacno: any = [
    { value: 'P29598', viewValue: 'P29598' },
    { value: 'HKP2403', viewValue: 'HKP2403' },
    { value: 'P6000', viewValue: 'P6000' },
    { value: 'P29599', viewValue: 'P29599' },
    { value: 'P58550', viewValue: 'P58550' },
    { value: 'TRT81A', viewValue: 'TRT81A' }
  ];
  contactno: any = [
    { value: '06818/TR', viewValue: '06818/TR' },
    { value: '07118/TR', viewValue: '07118/TR' },
    { value: '07218/TR', viewValue: '07218/TR' },
    { value: '06918/TR', viewValue: '06918/TR' },
    { value: '07018/TR', viewValue: '07018/TR' }
  ];
  displayedColumns = [
    'Buyer',
    'Group-Factory',
    'Contract-No',
    'Buyer-Contract-No',
    'Contract-Date',
    'Contract-Date2',
    'Quantity',
    'Shipment-Period',
    'Total-Price',
    'Priced',
    'Unpriced',
    'Final-Price',
    'Final-Price2',
    'Last-Pricing-Date',
    'Against',
    'Manage',
  ];
  transactions: any = [
    {
      buyer: 'ED & F Man',
      groupfactory: 'TR-กลุ่มไทยรุ่งเรือง',
      contactno: '06818/TR',
      buyercontacno: 'P29599',
      contactdata: '20/02/2017',
      typeofsugar: 'Hi-Raw',
      quanitity: 24000,
      shipmentperiod: '20/02/2017 - 20/05/2017',
      // totalprice:'',
      priced: '',
      unpriced: '',
      finalpriceusdmt: '',
      finalpriceclb: '',
      lastpriceingdata: '31/10/2017',
      againstmonth: '',
      manage: '',
    },
    {
      buyer: 'Bunge',
      groupfactory: 'TR-กลุ่มไทยรุ่งเรือง',
      contactno: '06918/TR',
      buyercontacno: 'P58550',
      contactdata: '15/03/2017',
      typeofsugar: 'Hi-Raw',
      quanitity: 24000,
      shipmentperiod: '01/04/2018 - 30/04/2018',
      // totalprice:'',
      priced: '',
      unpriced: '',
      finalpriceusdmt: '',
      finalpriceclb: '',
      lastpriceingdata: '31/05/2017',
      againstmonth: '',
      manage: '',
    },
    {
      buyer: 'Itochu',
      groupfactory: 'TR-กลุ่มไทยรุ่งเรือง',
      contactno: '07018/TR',
      buyercontacno: 'TRT81A',
      contactdata: '07/02/2017',
      typeofsugar: 'Hi-Raw',
      quanitity: 0,
      shipmentperiod: '',
      // totalprice:'',
      priced: '',
      unpriced: '',
      finalpriceusdmt: '',
      finalpriceclb: '',
      lastpriceingdata: '05/02/2018',
      againstmonth: '',
      manage: '',
    },
    {
      buyer: 'Bunge',
      groupfactory: 'TR-กลุ่มไทยรุ่งเรือง',
      contactno: '07218/TR',
      buyercontacno: 'P6000',
      contactdata: '01/09/2017',
      typeofsugar: 'REFINED SUGAR',
      quanitity: 0,
      shipmentperiod: '',
      // totalprice:'',
      priced: '',
      unpriced: '',
      finalpriceusdmt: '',
      finalpriceclb: '',
      lastpriceingdata: '26/01/2018',
      againstmonth: '',
      manage: '',
    },
    {
      buyer: 'Bunge',
      groupfactory: 'TR-กลุ่มไทยรุ่งเรือง',
      contactno: '07218/TR',
      buyercontacno: 'P6000',
      contactdata: '01/09/2017',
      typeofsugar: 'REFINED SUGAR',
      quanitity: 0,
      shipmentperiod: '',
      // totalprice:'',
      priced: '',
      unpriced: '',
      finalpriceusdmt: '',
      finalpriceclb: '',
      lastpriceingdata: '26/01/2018',
      againstmonth: '',
      manage: '',
    },
    {
      buyer: 'Bunge',
      groupfactory: 'TR-กลุ่มไทยรุ่งเรือง',
      contactno: '07218/TR',
      buyercontacno: 'P6000',
      contactdata: '01/09/2017',
      typeofsugar: 'REFINED SUGAR',
      quanitity: 24000,
      shipmentperiod: '',
      // totalprice:'',
      priced: '',
      unpriced: '',
      finalpriceusdmt: '',
      finalpriceclb: '',
      lastpriceingdata: '26/01/2018',
      againstmonth: '',
      manage: '',
    }
  ];
  colSpTopic: any;
  colSpSelect: any;
  colSpBtn: any;
  constructor(
    public route: Router,
    private odataFactory: ODataServiceFactory
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('SEScurrentUser'));
    //this.user = this.currentUser.user;
    this.odata = this.odataFactory.CreateService<any>('ses_pricings');

    this.odataLov = this.odataFactory.CreateService<any>('ses_lov_datas');
    this.odataParty = this.odataFactory.CreateService<any>('ses_party');
  }

  ngOnInit() {
    this.colSpTopic = (window.innerWidth <= 400) ? 6 : 2;
    this.colSpSelect = (window.innerWidth <= 400) ? 6 : 2;
    this.colSpBtn = (window.innerWidth <= 400) ? 6 : 1;
    this.screenwidth = window.innerWidth
    combineLatest(
      this.odataLov
        .Query()
        //.Expand('Processes($expand=ApproveFlow($expand=AFApproveFlowDetails($expand=AFDPosition)),Role)')
        //.Filter("WorkFlowType eq 'PR'")
        .Exec(),
      this.odataParty
        .Query()
        //.Expand('Processes($expand=ApproveFlow($expand=AFApproveFlowDetails($expand=AFDPosition)),Role)')
        //.Filter("WorkFlowType eq 'PR'")
        .Exec()
    ).subscribe(T => {
      this.allLOVs = T[0];
      this.allPartys = T[1];
      this.getPagedData();
      this.calTotal();
    }, (error) => {
      if (error.status == 401) {
        this.route.navigate(['/login'], { queryParams: { error: 'Session Expire!' } });
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

  private getPagedData() {
    this.query = this.odata
      .Query()
    //.Filter("CreatedBy/Id eq '" + this.user.Id + "'" + this.qType)
    //.Expand('Company, Plant,BudgetType, CostCenter, IO,  Job($expand=SendFrom,SendTo), CreatedBy')
    //.Select(['Id', 'CreatedDt', 'BudgetReqNo', 'BudgetType', 'Year', 'Quarter', 'Month', 'CostCenter', 'Company', 'Plant', 'IO', 'Job', 'Status', 'CreatedBy']);
    if (this.filter) {
      if (this.filter.rows) {
        this.query = this.query.Top(this.filter.rows);
      }

      if (this.filter.first) {
        this.query = this.query.Skip(this.filter.first);
      }

      if (this.filter.filters) {
        const filterOData: string[] = [];
        for (const filterProperty in this.filter.filters) {
          if (this.filter.filters.hasOwnProperty(filterProperty)) {
            const filter = this.filter.filters[filterProperty] as FilterMetadata;
            if (filter.matchMode && filter.matchMode !== '') {
              const params = filter.matchMode.toLowerCase().split(':');
              const operator = params[0];

              // Replace Boss.Name by Boss/Name
              const odataProperty = filterProperty.replace(/\./g, '/');

              // http://docs.oasis-open.org/odata/odata/v4.0/odata-v4.0-part2-url-conventions.html
              switch (operator) {
                case 'length':
                case 'day':
                case 'fractionalseconds':
                case 'hour':
                case 'minute':
                case 'month':
                case 'second':
                case 'totaloffsetminutes':
                case 'totalseconds':
                case 'year':
                  filterOData.push(`${operator}(${odataProperty}) ${params[1]} ${filter.value}`);
                  break;
                case 'eq':
                case 'ne':
                case 'gt':
                case 'ge':
                case 'lt':
                case 'le':
                  filterOData.push(`${odataProperty} ${operator} ${filter.value}`);
                  break;
                case 'contains':
                case 'endswith':
                case 'contains':
                  filterOData.push(`${operator}(${odataProperty}, '${filter.value}')`);
                  break;
                default:
                // no action
              }
            }
          }
        }

        if (filterOData.length > 0) {
          this.query = this.query.Filter(filterOData.join(' and '));
        }
      }

      if (this.filter.sortField) {
        const sortOrder: string = this.filter.sortOrder && this.filter.sortOrder > 0 ? 'asc' : 'desc';
        this.query = this.query.OrderBy(this.filter.sortField + ' ' + sortOrder);
      }
    }


    this.query
      .Exec(ODataExecReturnType.PagedResult)
      .subscribe((pagedResult: ODataPagedResult<any>) => {
        this.transactions = pagedResult.data;
        this.totalRecords = pagedResult.count;
      }, (error) => {
        this.transactions = [];
        this.totalRecords = 0;

        if (error.status == 401) {
          this.route.navigate(['/login'], { queryParams: { error: 'Session Expire!' } });
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

  onResize(event) {
    this.colSpTopic = (event.target.innerWidth <= 400) ? 6 : 2;
    this.colSpSelect = (event.target.innerWidth <= 400) ? 6 : 2;
    this.colSpBtn = (event.target.innerWidth <= 400) ? 6 : 1;
    this.screenwidth = event.target.innerWidth
  }

  onDetail() {
    this.route.navigate(['/pricing-Detail'])
  }

  onDelete() {
    confirm("คุณต้องการลบหรือไม่");
  }


  calTotal() {
    this.total = 0;
    this.lots = 0;
    let res = 0;
    this.transactions.forEach(tran => {
      this.total = this.total + tran.quanitity
      res = res + tran.quanitity / 50.8
    });
    this.lots = Math.round(res)
    console.log(this.total);
  }























}
