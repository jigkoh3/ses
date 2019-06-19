import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material'
import { fuseAnimations } from '@fuse/animations';
import { Router } from '@angular/router';
import { ODataConfiguration, ODataExecReturnType, ODataPagedResult, ODataQuery, ODataService, ODataServiceFactory } from 'angular-odata-es5'

import { filter, FilterMetadata, lov_data, party, contract, user_data } from '../../../shared';
import { ODataConfigurationFactory } from '../../../ODataConfigurationFactory';
import { combineLatest } from 'rxjs';
import * as _ from 'lodash';
import { Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import {
  trigger,
  state,
  style,
  transition,
  animate,

} from '@angular/animations';
import { MatSnackBar } from '@angular/material';
import * as _moment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FlexAlignStyleBuilder } from '@angular/flex-layout';
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

@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.scss'],
  animations: [trigger('detailExpand', [
    state(
      'collapsed',
      style({ height: '0px', minHeight: '0', visibility: 'hidden' })
    ),
    state('expanded', style({ height: '*', visibility: 'visible' })),
    transition(
      'expanded <=> collapsed',
      animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
    ),
  ]), fuseAnimations],
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: ODataConfiguration, useFactory: ODataConfigurationFactory }, ODataServiceFactory],
})
export class ContractListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  expandedElement: Array<string>;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  isExpansionDetailRow = (i: number, row: Object) =>
    row.hasOwnProperty('detailRow');

  total: any;
  lots: any;
  screenwidth: any;

  public count: number = 0;

  public totalRecords: number;

  public filterText = "";

  public filter: filter = {
    first: 0,
    rows: 5,
    sortField: 'contract_date',
    sortOrder: -1,
  };

  public query: ODataQuery<any>;

  private odata: ODataService<contract>;
  private odataLov: ODataService<lov_data>;
  private odataParty: ODataService<party>;

  allLOVs: lov_data[];
  allPartys: party[];

  currentUser;
  user: user_data;
  contract_no = "";
  buyer_contract_no = "";

  contract_date_from = null;
  contract_date_to = null;
  selectedContractStatus;
  selectedBuyer;
  selectedSugarType;
  selectedGroupFactory;
  buyers: any = [];
  groupfactorys: any = [];
  sugartypes: any = [];
  contactstatuses: any = [
    { value: 'DRAFT', viewValue: 'Draft' },
    { value: 'SUBMIT', viewValue: 'Submit' },
  ];
  displayedColumns = [
    'id',
    'contract_no',
    'contract_date',
    // 'contract_type',
    'buyer_contract_no',
    'buyer.party_name',
    'sugar_type.lov1',
    'contract_made_on.lov1',
    'crop_year',
    'group_factory.lov1',
    'shipment_term.shipterm_name',
    'ship_period_from',
    'ship_period_to',
    'total_qty',
    'payment_term.pmt_abbv',
    'total_shipment',
    'currency.cur_code',
    'contract_status'
  ];

  displayedDetailColumns = [
    'addendum_no.',
    'addendum_date',
    'addendum_type',
    'contract_status',
    'sugar_type.lov1',
    'buyer_contract_no',
    'buyer.party_name',
    'total_qty'
  ];
  dataSource: any = [

  ];

  constructor(
    public route: Router,
    private odataFactory: ODataServiceFactory,
    private _matSnackBar: MatSnackBar,
    private _matDialog: MatDialog,
    private router : Router,
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('SEScurrentUser'));
    this.user = this.currentUser.user;
    this.odata = this.odataFactory.CreateService<contract>('ses_contracts');

    this.odataLov = this.odataFactory.CreateService<lov_data>('ses_lov_datas');
    this.odataParty = this.odataFactory.CreateService<party>('ses_parties');
  }

  ngOnInit() {
    // this.colSpTopic = (window.innerWidth <= 400) ? 6 : 2;
    // this.colSpSelect = (window.innerWidth <= 400) ? 6 : 2;
    // this.colSpBtn = (window.innerWidth <= 400) ? 6 : 1;
    // this.screenwidth = window.innerWidth
    combineLatest(
      this.odataLov
        .Query()
        //.Expand('Processes($expand=ApproveFlow($expand=AFApproveFlowDetails($expand=AFDPosition)),Role)')
        //.Filter("record_status eq true")
        .Exec(),
      this.odataParty
        .Query()
        // .Expand(',Role)')
        .Filter("record_status eq true")
        .Exec()
    ).subscribe(T => {
      this.allLOVs = T[0];
      this.allPartys = T[1];

      //[lov_code,lov1]+[SYSTEM,Sugar Type]
      this.sugartypes = _.orderBy(_.filter(this.allLOVs, function (o) {
        return o.lov_group == 'SYSTEM' && o.lov_type == 'Sugar Type'
      }), 'lov1');

      //[lov_code,lov1]+[SYSTEM,Group Factory]+[lov2 is not null]
      this.groupfactorys = _.orderBy(_.filter(this.allLOVs, function (o) {
        return o.lov_group == 'SYSTEM' && o.lov_type == 'Group Factory' && o.lov2
      }), 'lov1');

      //p.record_status = 1 and p.party_type like ‘%buyer%’ order by 2
      this.buyers = _.orderBy(_.filter(this.allPartys, function (o) {
        return o.record_status == true && o.party_type.indexOf('buyer') > -1
      }), 'party_name');

      this.getPagedData();
      //this.calTotal();
    }, (error) => {
      if (error.status == 401) {
        this.route.navigate(['/login'], { queryParams: { error: 'Session Expire!' } });
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
        //this.msgs = { severity: 'error', summary: 'Error', detail: detail };
        this._matSnackBar.open(detail, 'ERROR', {
          verticalPosition: 'top',
          duration: 10000
        });
      } else if (error.status == 0) {
        this._matSnackBar.open('Cannot connect to server. Please contact administrator.', 'ERROR', {
          verticalPosition: 'top',
          duration: 10000
        });
        //this.msgs = { severity: 'error', summary: 'Error', detail: 'Cannot connect to server. Please contact administrator.' };
      }

      console.log('ODataExecReturnType.PagedResult ERROR ' + JSON.stringify(error));
    });
    // this.calTotal();
  }

  checkDate(event) {
    console.log(event);
  }

  onSearch() {

    this.filterText = "";

    let stringArry: string[] = [];
    if (this.contract_no) {
      stringArry.push("contains(contract_no, '" + this.contract_no + "')")
    }

    if (this.buyer_contract_no) {
      stringArry.push("contains(buyer_contract_no, '" + this.buyer_contract_no + "')")
    }

    if (this.contract_date_from) {
      stringArry.push("contract_date_from gt '" + this.contract_date_from + "'")
    }

    if (this.contract_date_to) {
      stringArry.push("contract_date_to lt '" + this.contract_date_to + "'")
    }

    if (this.selectedContractStatus) {
      stringArry.push("contract_status eq '" + this.selectedContractStatus + "'")
    }

    if (this.selectedBuyer) {
      stringArry.push("buyer_id eq '" + this.selectedBuyer + "'")
    }

    if (this.selectedSugarType) {
      stringArry.push("sugar_type_id eq '" + this.selectedSugarType + "'")
    }

    if (this.selectedContractStatus) {
      stringArry.push("group_factory_id eq '" + this.selectedGroupFactory + "'")
    }

    this.filterText = stringArry.join(' and ');
    this.getPagedData();
  }

  private getPagedData() {
    let filter = "";
    if (this.filterText) {
      filter = this.filterText + "and record_status eq true and latest_flag eq true"
    } else {
      filter = "record_status eq true and latest_flag eq true";
    }

    this.query = this.odata
      .Query()
      .Filter(filter)
      .Expand('buyer, sugar_type, contract_made_on, group_factory, shipment_term,  payment_term, currency')//, contract_items
      .Select(['id',
        'contract_type',
        'contract_no',
        'contract_date',
        'buyer_contract_no',
        'buyer/party_name',
        'sugar_type/lov1',
        'contract_made_on/lov1',
        'crop_year',
        'group_factory/lov1',
        'shipment_term/shipterm_name',
        'shipment_period_from',
        'shipment_period_to',
        'total_qty',
        'payment_term/pmt_abbv',
        'total_shipment',
        'currency/cur_code',
        'contract_status'
      ]);
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
      .subscribe((pagedResult: ODataPagedResult<contract>) => {
        this.dataSource = pagedResult.data;
        this.totalRecords = pagedResult.count;
      }, (error) => {
        this.dataSource = [];
        this.totalRecords = 0;

        if (error.status == 401) {
          this.route.navigate(['/login'], { queryParams: { error: 'Session Expire!' } });
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
        } else if (error.status == 0) {
          this._matSnackBar.open('Cannot connect to server. Please contact administrator.', 'ERROR', {
            verticalPosition: 'top',
            duration: 10000
          });
          
        }

        console.log('ODataExecReturnType.PagedResult ERROR ' + JSON.stringify(error));
      });

  }

  onAdd() {
    this.route.navigate(['contract-detail'], { queryParams: { mode: 'Add' } })
  }

  onView(data) {
    this.route.navigate(['contract-detail', data.id], { queryParams: { mode: 'View' } })
  }

  onEdit(data) {
    this.route.navigate(['contract-detail', data.id], { queryParams: { mode: 'Edit' } })
  }

  onDelete(data: contract) {
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.odata.Get(data.id)
          .Select('updated_by_id, updated_date')
          .Exec()
          .subscribe((old: contract) => {
            if (!old.updated_date || moment(old.updated_date).toDate().getTime() == moment(data.updated_date).toDate().getTime()) {

              this.odata.Patch({
                updated_by_id: this.user.employee_username,
                updated_date: moment().toDate(),
                record_status: false,
                latest_flag: false
              }, data.id)
                .Exec()
                .subscribe(res => {
                  this._matSnackBar.open('Contract Deleted.', 'OK', {
                    verticalPosition: 'top',
                    duration: 10000
                  });
                  this.getPagedData();
                }, (error) => {
                  if (error.status == 401) {
                    this.router.navigate(['/login'], { queryParams: { error: 'Session Expire!' } });
                    
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

                  } else if (error.status == 0) {
                    this._matSnackBar.open('Cannot connect to server. Please contact administrator.', 'ERROR', {
                      verticalPosition: 'top',
                      duration: 10000
                    });
                  
                  }
            
                  console.log('ODataExecReturnType.PagedResult ERROR ' + JSON.stringify(error));
                })
            }else{
              this._matSnackBar.open("Cannot save.Contract has been edit by " + old.updated_by_id, 'ERROR', {
                verticalPosition: 'top',
                duration: 10000
              });
            }
          }, (error) => {
            if (error.status == 401) {
              this.router.navigate(['/login'], { queryParams: { error: 'Session Expire!' } });
            
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
            } else if (error.status == 0) {
              this._matSnackBar.open('Cannot connect to server. Please contact administrator.', 'ERROR', {
                verticalPosition: 'top',
                duration: 10000
              });
            }
      
            console.log('ODataExecReturnType.PagedResult ERROR ' + JSON.stringify(error));
          });
      }
      this.confirmDialogRef = null;
    });
  }

  onAddAddendem(data){
    
    this.route.navigate(['addendum-detail'], { queryParams: {ref : data.id,  mode: 'Edit' } })
  }

  toggleRow(row) {
    if (this.expandedElement === row) {
      this.expandedElement = null;
    } else {
      this.expandedElement = row;
    }
  }



  PageData(pageEvent: PageEvent) {
    this.filter.first = pageEvent.pageIndex * pageEvent.pageSize;
    this.filter.rows = pageEvent.pageSize;
    this.getPagedData();
  }

  sortData(sort: Sort) {
    const data = this.dataSource;
    if (!sort.active || sort.direction === '') {
      this.dataSource = data;
      return;
    }


    const isAsc = sort.direction === 'asc';
    this.filter.sortOrder = sort.direction == 'asc' ? 1 : -1;
    switch (sort.active) {
      case 'Contract No':
        this.filter.sortField = "contract_no";
      case 'Contract Date':
        this.filter.sortField = "contract_date";
      case 'Buyer Contract':
        this.filter.sortField = "buyer_contract";
      case 'Buyer':
        this.filter.sortField = "buyer/party_name";
      case 'SugarType':
        this.filter.sortField = "sugar_type/lov1";
      case 'Made by':
        this.filter.sortField = "made_by/lov1";
      case 'Corp Year':
        this.filter.sortField = "crop_year";
      case 'Group Factory':
        this.filter.sortField = "group_factory/lov1";
      case 'Shipment Term':
        this.filter.sortField = "shipment_term/ship_term_name";
      case 'Shipment Period From':
        this.filter.sortField = "ship_period_from";
      case 'Shipment Period To':
        this.filter.sortField = "ship_period_to";
      case 'Quantity(MT)':
        this.filter.sortField = "qty";
      case 'Shipment':
        this.filter.sortField = "shipment_term.shipterm_name";
      case 'Payment Term':
        this.filter.sortField = "ses_payment_term.pmt_abbv";
      case 'Currency':
        this.filter.sortField = "ses_currency.name_en";
      case 'Contract Status':
        this.filter.sortField = "contract_status";
      // default: 
      // return 0;
    }
    this.getPagedData();
  }
}
