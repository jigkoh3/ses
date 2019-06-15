import { lov_data } from './lov_data';

export class product {
    id: string;
    name_en: string;
    name_th: string;
    name_in_contract: string;
    sugar_type_id: string;
    sugar_type: lov_data;
    sugar_group_id: string;
    sugar_group: lov_data;
    invoice_template_id: string;
    invoice_template: lov_data;
    min_pola: number;
    max_moisture: number;
    min_colour: number;
    max_colour: number;
    brix: number;
    shelf_life: number;
    apply_licenses_flag: boolean;
    record_status: boolean;
    created_by_id: string;
    created_date: Date;
    updated_by_id: string;
    updated_date: Date;
}