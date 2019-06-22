import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ODataService, ODataConfiguration, ODataServiceFactory, ODataQuery, ODataExecReturnType, ODataPagedResult } from 'angular-odata-es5';
import { fuseAnimations } from '@fuse/animations';
import { ODataConfigurationFactory } from 'app/ODataConfigurationFactory';
import { lov_data, party, filter, FilterMetadata } from 'app/shared';
import { FormBuilder, FormGroup } from '@angular/forms';
import { combineLatest } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-pricing-white-list',
  templateUrl: './pricing-white-list.component.html',
  styleUrls: ['./pricing-white-list.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: ODataConfiguration, useFactory: ODataConfigurationFactory }, ODataServiceFactory],
})
export class PricingWhiteListComponent implements OnInit {
  total: any;
  lots: any;
  screenwidth: any;
  private odata: ODataService<any>;
  private odataLov: ODataService<lov_data>;
  private odataParty: ODataService<party>;
  currentUser;
  user;
  allLOVs: lov_data[];
  allPartys: party[];
  buyers: any = [];
  groupfactorys: any = [];
  buyercontacno;
  contactno;

  form: FormGroup;
  public query: ODataQuery<any>;

  public count: number = 0;

  public totalRecords: number;

  public filter: filter;

  displayedColumns = [
    'id',
    'buyer.party_name',
    'group_factory.lov1',
    'type_of_sugar.lov1',
    'qty',
    'shipment_from',
    'shipment_to',
    'total_pricing',
    'priced',
    'unpriced',
    'confirm_price_usd',
    'confirm_price_cent',
  ];
  dataSource: any = [];
  constructor(
    private _formBuilder: FormBuilder,
    public router: Router,
    private odataFactory: ODataServiceFactory
  ) {
    this.odata = this.odataFactory.CreateService<any>('ses_pricings');

    this.odataLov = this.odataFactory.CreateService<lov_data>('ses_lov_datas');
    this.odataParty = this.odataFactory.CreateService<party>('ses_parties');
  }

  ngOnInit() {
    this.form = this._formBuilder.group({
      buyer_id: [''],
      groupfactory: [''],
      buyercontractno: [''],
      contarctno: ['']
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

      this.getPagedData();

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

  private getPagedData() {
    this.query = this.odata
      .Query()
      //.Filter("CreatedBy/Id eq '" + this.user.Id + "'" + this.qType)
      .Expand('buyer, group_factory, type_of_sugar')
    // .Select(['id',
    //     'buyer/party_name',
    //     'group_factory/lov1',
    //     'future_market/lov1',
    // ]);
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
        this.dataSource = pagedResult.data;
        this.totalRecords = pagedResult.count;
      }, (error) => {
        // this.dataSource = [];
        this.totalRecords = 0;

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

  onAdd(): void {
    this.router.navigate(['/pricing-white-detail'], { queryParams: { mode: 'Add' } })
}


  onView() {
    this.router.navigate(['/pricing-white-detail'], { queryParams: { mode: 'View' } })
  }

  onEdit() {
    this.router.navigate(['/pricing-white-detail'], { queryParams: { mode: 'Edit' } })
  }

  onDelete() {
    confirm("คุณต้องการลบหรือไม่");
  }


}
