import { province } from './province';
import { party } from './party';

export class shipment_to {
    id: string;
    name_en: string;
    name_th: string;
    sht_address: string;
    province_id: string;
    province: province;
    party_id: string;
    party: party;
    record_status: boolean;
    created_by_id: string;
    created_date: Date;
    updated_by_id: string;
    updated_date: Date;
}