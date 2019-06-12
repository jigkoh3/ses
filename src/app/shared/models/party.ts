import { country } from './country';

export class party {
    id: number;
    party_name: string;
    party_abbv: string;
    party_addr1: string;
    party_addr2: string;
    country_id: string;
    country: country;
    party_type: string;
    record_status: boolean;
    created_by_id:string;
    created_date:Date;
    updated_by_id:string;
    updated_date:Date;
}
