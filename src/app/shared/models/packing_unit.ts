import { unit_code } from './unit_code';

export class packing_unit {
    id: string;
    pu_code: string;
    name_en: string;
    name_th: string;
    name_in_contract: string;
    bulk_pack: string;
    unit_code_id: string;
    unit_code: unit_code;
    gross_weight: number;
    net_weight: number;
    packing_cost_usd_ton: number;
    record_status: boolean;
    created_by_id:string;
    created_date:Date;
    updated_by_id:string;
    updated_date:Date;
}