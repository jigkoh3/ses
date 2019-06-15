import { lov_data } from './lov_data';

export class term_cond {
    id: string;
    tc_code: string;
    partial_shipment_option: string;
    //partial_shipment_option: lov_data;
    tc_in_contract: string;
    record_status: boolean
    created_by_id: string;
    created_date: Date;
    updated_by_id: string;
    updated_date: Date;
}