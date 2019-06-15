import { pricing } from './pricing';

export class pricing_other {
    id: string;
    pricing_id: string;
    pricing: pricing; //set Null when post or put
    others_no: number;
    others_desc: string;
    amount: number;
    created_by_id: string;
    created_date: Date;
    updated_by_id: string;
    updated_date: Date;

}