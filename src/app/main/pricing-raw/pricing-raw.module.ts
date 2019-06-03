import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { PricingRawComponent } from './pricing-raw.component';

const routes = [
  {
      path     : 'pricing-raw',
      component: PricingRawComponent
  }
];

@NgModule({
  declarations: [
    PricingRawComponent
  ],
  imports: [
    RouterModule.forChild(routes),

        TranslateModule,

        FuseSharedModule
  ],
  exports: [
    PricingRawComponent
  ]
})
export class PricingRawModule { }
