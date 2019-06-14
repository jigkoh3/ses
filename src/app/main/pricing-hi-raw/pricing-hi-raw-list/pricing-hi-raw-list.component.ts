import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ODataConfiguration, ODataExecReturnType, ODataPagedResult, ODataQuery, ODataService, ODataServiceFactory } from 'angular-odata-es5'

import { filter, FilterMetadata, lov_data, party } from '../../../shared';
import { ODataConfigurationFactory } from '../../../ODataConfigurationFactory';
import { combineLatest } from 'rxjs';
import * as _ from 'lodash';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { fuseAnimations } from '@fuse/animations';
import { Router } from '@angular/router';

@Component({
    selector: 'pricing-hi-raw-list',
    templateUrl: './pricing-hi-raw-list.component.html',
    styleUrls: ['./pricing-hi-raw-list.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
    providers: [{ provide: ODataConfiguration, useFactory: ODataConfigurationFactory }, ODataServiceFactory],
})
export class PricingHiRawListComponent implements OnInit {

    form: FormGroup;
    public query: ODataQuery<any>;

    private odata: ODataService<any>;
    private odataLov: ODataService<lov_data>;
    private odataParty: ODataService<party>;

    allLOVs: lov_data[];
    allPartys: party[];

    currentUser;
    total: any;
    lots: any;
    screenwidth: any;

    public count: number = 0;

    public totalRecords: number;

    public filter: filter;

    buyers: any = [];
    groupfactorys: any = [];

    // Private

    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _formBuilder: FormBuilder,
        public route: Router,
        private odataFactory: ODataServiceFactory
    ) {
        // Set the private defaults
        this.currentUser = JSON.parse(localStorage.getItem('SEScurrentUser'));
        this.odata = this.odataFactory.CreateService<any>('ses_pricings');

        this.odataLov = this.odataFactory.CreateService<lov_data>('ses_lov_datas');
        this.odataParty = this.odataFactory.CreateService<party>('ses_parties');
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Reactive Form
        this.form = this._formBuilder.group({
            buyer: [''],
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

            //p.record_status = 1 and p.party_type like ‘%buyer%’ order by 2
            this.buyers = _.orderBy(_.filter(this.allPartys, function (o) {
                return o.record_status == true && o.party_type.indexOf('buyer') > -1
            }), 'party_name');

            // this.getPagedData();
            //this.calTotal();
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

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    onSearch(formdata): void {
        console.log(formdata.value);
    }

    // private getPagedData() {
    //     this.query = this.odata
    //         .Query()
    //     //.Filter("CreatedBy/Id eq '" + this.user.Id + "'" + this.qType)
    //     //.Expand('Company, Plant,BudgetType, CostCenter, IO,  Job($expand=SendFrom,SendTo), CreatedBy')
    //     //.Select(['Id', 'CreatedDt', 'BudgetReqNo', 'BudgetType', 'Year', 'Quarter', 'Month', 'CostCenter', 'Company', 'Plant', 'IO', 'Job', 'Status', 'CreatedBy']);
    //     if (this.filter) {
    //         if (this.filter.rows) {
    //             this.query = this.query.Top(this.filter.rows);
    //         }

    //         if (this.filter.first) {
    //             this.query = this.query.Skip(this.filter.first);
    //         }

    //         if (this.filter.filters) {
    //             const filterOData: string[] = [];
    //             for (const filterProperty in this.filter.filters) {
    //                 if (this.filter.filters.hasOwnProperty(filterProperty)) {
    //                     const filter = this.filter.filters[filterProperty] as FilterMetadata;
    //                     if (filter.matchMode && filter.matchMode !== '') {
    //                         const params = filter.matchMode.toLowerCase().split(':');
    //                         const operator = params[0];

    //                         // Replace Boss.Name by Boss/Name
    //                         const odataProperty = filterProperty.replace(/\./g, '/');

    //                         // http://docs.oasis-open.org/odata/odata/v4.0/odata-v4.0-part2-url-conventions.html
    //                         switch (operator) {
    //                             case 'length':
    //                             case 'day':
    //                             case 'fractionalseconds':
    //                             case 'hour':
    //                             case 'minute':
    //                             case 'month':
    //                             case 'second':
    //                             case 'totaloffsetminutes':
    //                             case 'totalseconds':
    //                             case 'year':
    //                                 filterOData.push(`${operator}(${odataProperty}) ${params[1]} ${filter.value}`);
    //                                 break;
    //                             case 'eq':
    //                             case 'ne':
    //                             case 'gt':
    //                             case 'ge':
    //                             case 'lt':
    //                             case 'le':
    //                                 filterOData.push(`${odataProperty} ${operator} ${filter.value}`);
    //                                 break;
    //                             case 'contains':
    //                             case 'endswith':
    //                             case 'contains':
    //                                 filterOData.push(`${operator}(${odataProperty}, '${filter.value}')`);
    //                                 break;
    //                             default:
    //                             // no action
    //                         }
    //                     }
    //                 }
    //             }

    //             if (filterOData.length > 0) {
    //                 this.query = this.query.Filter(filterOData.join(' and '));
    //             }
    //         }

    //         if (this.filter.sortField) {
    //             const sortOrder: string = this.filter.sortOrder && this.filter.sortOrder > 0 ? 'asc' : 'desc';
    //             this.query = this.query.OrderBy(this.filter.sortField + ' ' + sortOrder);
    //         }
    //     }


    //     this.query
    //         .Exec(ODataExecReturnType.PagedResult)
    //         .subscribe((pagedResult: ODataPagedResult<any>) => {
    //             // this.dataSource = pagedResult.data;
    //             this.totalRecords = pagedResult.count;
    //         }, (error) => {
    //             // this.dataSource = [];
    //             this.totalRecords = 0;

    //             if (error.status == 401) {
    //                 this.route.navigate(['/login'], { queryParams: { error: 'Session Expire!' } });
    //                 console.log('Session Expire!');
    //             } else if (error.status != 401 && error.status != 0) {
    //                 let detail = "";
    //                 detail = error.error.message;
    //                 if (error.error.InnerException) {
    //                     detail += '\n' + error.error.InnerException.ExceptionMessage;
    //                 }
    //                 //this.msgs = { severity: 'error', summary: 'Error', detail: detail };
    //             } else if (error.status == 0) {
    //                 //this.msgs = { severity: 'error', summary: 'Error', detail: 'Cannot connect to server. Please contact administrator.' };
    //             }

    //             console.log('ODataExecReturnType.PagedResult ERROR ' + JSON.stringify(error));
    //         });


    // }
}
