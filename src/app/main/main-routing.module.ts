import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        children: [
            { path: 'pricingraw',loadChildren: './pricing-raw/pricing-raw.module#PricingRawModule' },
            { path: 'pricing-detail',loadChildren: './pricing-raw/pricing-raw.module#PricingRawModule' },
            { path: 'pricingwhite',loadChildren: './pricing-white/pricing-white.module#PricingWhiteModule' },
            { path: 'pricing-white-detail',loadChildren: './pricing-white/pricing-white.module#PricingWhiteModule' },
            { path: 'contract',loadChildren: './contract/contract.module#ContractModule'},
            { path: 'contract-detail',loadChildren: './contract/contract.module#ContractModule'},
            { path: 'addendum-detail',loadChildren: './addendum/addendum.module#AddendumModule'},
          
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule { }