import { lov_data } from './lov_data';
import { contract } from './contract';
import { party } from './party';
import { pricing_other } from './pricing_other';
import { pricing_tran } from './pricing_tran';

//////ODATA//////
// if (this.validate()) {
//     this.loading = true;

//     let pricing = _.cloneDeep(this.pricing);

//     pricing.pricing_template = null;
//     pricing.type_of_sugar = null;
//     pricing.future_market = null;
//     pricing.buyer = null;
//     pricing.group_factory = null;
//     pricing.contract
//     pricing.contract_month = null;
//     pricing.contract_made_on = null;
//     pricing.portion = null;

//     for (let pricing_trans of pricing.pricing_trans) {
//         pricing_trans.priceing = null;
//         pricing_trans.future_market = null;
//         pricing_trans.ag_month= null;
//     }

//     for (let pricing_other of pricing.pricing_others) {
//         pricing_other.priceing = null;
//     }

//     if (this.id) {
//         this.odata.Put(
//             priceing
//             , this.id
//           ).subscribe(
//             resolve => {
//               console.log('Pricingt: update success!');
//               this.loading = false;
//               this.router.navigateByUrl(
//                 this.router.createUrlTree(
//                   [this.retUrl], { queryParams: { type: this.type } }
//                 )
//               );
//             }, error => {
//               this.loading = false;
//               console.log(error);
//               // this.alert.messageType = "danger";
//               // this.alert.message = error;
//               if (error.status == 401) {
//                 this.router.navigate(['/login'], { queryParams: { error: 'Session Expire!' } });
//                 console.log('Session Expire!');
//               } else if (error.status != 401 && error.status != 0) {
//                 let detail = "";
//                 detail = error.error.error.message;
//                 if (error.error.error.InnerException) {
//                   detail += '\n' + error.error.error.InnerException.ExceptionMessage;
//                 }else if (error.error.error.innererror) {
//                   detail += '\n' + error.error.error.innererror.message;
//                 }
//                 this.msgs = { severity: 'error', summary: 'Error', detail: detail };
//               } else if (error.status == 0) {
//                 this.msgs = { severity: 'error', summary: 'Error', detail: 'Cannot connect to server. Please contact administrator.' };
//               }
//             });
//     }else{
//         this.odata.Post(pricing)
//         .subscribe(
//             resolve => {
//               console.log('Pricing: save success!');
//               this.loading = false;
//               this.router.navigateByUrl(
//                 this.router.createUrlTree(
//                   [this.retUrl], { queryParams: { type: this.type } }
//                 )
//               );

//             }, error => {
//               console.log(error);
//               this.loading = false;
//               // this.alert.messageType = "danger";
//               // this.alert.message = error;
//               if (error.status == 401) {
//                 this.router.navigate(['/login'], { queryParams: { error: 'Session Expire!' } });
//                 console.log('Session Expire!');
//               } else if (error.status != 401 && error.status != 0) {
//                 let detail = "";
//                 detail = error.error.error.message;
//                 if (error.error.error.InnerException) {
//                   detail += '\n' + error.error.error.InnerException.ExceptionMessage;
//                 }else if (error.error.error.innererror) {
//                   detail += '\n' + error.error.error.innererror.message;
//                 }
//                 this.msgs = { severity: 'error', summary: 'Error', detail: detail };
//               } else if (error.status == 0) {
//                 this.msgs = { severity: 'error', summary: 'Error', detail: 'Cannot connect to server. Please contact administrator.' };
//               }
//             });
//     }
//////END ODATA//////

export class pricing {
    id: string;
    pricing_template_id: string;
    pricing_template: lov_data;
    type_of_sugar_id: string;
    type_of_sugar: lov_data; //set Null when post or put
    future_market_id: string;
    future_market: lov_data; //set Null when post or put
    buyer_id: string;
    buyer: party; //set Null when post or put
    qty: number;
    group_factory_id: string;
    group_factory: lov_data; //set Null when post or put
    shipment_from: Date;
    shipment_to: Date;
    buyer_contract_no: string;
    contract_id: string;
    contract: contract; //set Null when post or put
    contract_date: Date;
    premium_cent: number;
    contract_month_id: string;
    contract_month: lov_data; //set Null when post or put
    contract_year: number;
    crop_year: number;
    contract_made_on_id: string;
    contract_made_on: lov_data; //set Null when post or put
    portion_id: string;
    portion: lov_data; //set Null when post or put
    remark: string;
    sum_sell: number;
    sum_buy: number;
    net_sell: number;
    net_buy: number;
    sum_others: number;
    provisional_price: number;
    average_price: number;
    final_price_cent: number;
    final_price_usd: number;
    total_pricing: number;
    priced: number;
    unpriced: number;
    pricing_result: string;
    confirm_flag: boolean;
    confirm_price_cent: number;
    confirm_price_usd: number;
    wp_flag: boolean;
    wp_request: number;
    wp_tot_pricing_lot: number;
    wp_tot_priced_lot: number;
    wp_tot_usd: number;
    wp_tot_priced_sell_usd: number;
    wp_tot_priced_buy_usd: number;
    wp_ny_net_sell: number;
    wp_ny_net_buy: number;
    avg_ny_price: number;
    avg_ln_price: number;
    record_status: number;
    created_by_id: string;
    created_date: Date;
    updated_by_id: string;
    updated_date: Date;
    pricing_trans: pricing_tran[];
    pricing_others: pricing_other[];
}