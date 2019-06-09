import { NgModule } from '@angular/core';

import { PricingRawModule } from 'app/main/pricing-raw/pricing-raw.module';
import { PricingWhiteModule } from 'app/main/pricing-white/pricing-white.module';
import { ContractModule } from 'app/main/contract/contract.module';


@NgModule({
    imports: [
        PricingRawModule,
        PricingWhiteModule,
        ContractModule,
    ],
    exports: [
        PricingRawModule,
        PricingWhiteModule,
        ContractModule,
    ]
})
export class MainModule
{
}