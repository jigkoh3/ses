import { lov_data } from './lov_data';
import { pricing } from './pricing';




export class pricing_tran {
    id: string;
    pricing_id: string;
    pricing: pricing; //set Null when post or put
    pricing_type: string;
    order_date: Date;
    sell_lots: number;
    buy_lots: number;
    future_market_id: string;
    future_market: lov_data; //set Null when post or put
    ag_month_id: string;
    ag_month: lov_data; //set Null when post or put
    ag_year: number;
    priced: number;
    execute_on: Date;
    pricing_status: string;
    created_by_id: string;
    created_date: Date;
    updated_by_id: string;
    updated_date: Date;
}