import { NgModule } from '@angular/core';

import { PricingRawModule } from 'app/main/pricing-raw/pricing-raw.module';
import { PricingWhiteModule } from 'app/main/pricing-white/pricing-white.module';
import { ContractModule } from 'app/main/contract/contract.module';
import { PricingHiRawModule } from './pricing-hi-raw/pricing-hi-raw.module';


@NgModule({
    imports: [
        PricingRawModule,
        PricingWhiteModule,
        ContractModule,
        PricingHiRawModule
    ],
    exports: [
        PricingRawModule,
        PricingWhiteModule,
        ContractModule,
        PricingHiRawModule
    ]
})
export class MainModule
{
}