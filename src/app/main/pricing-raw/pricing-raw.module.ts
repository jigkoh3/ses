import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { MatTableModule, MatPaginatorModule, MatSortModule } from '@angular/material'  
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

        FuseSharedModule,

        MatTableModule,
        MatPaginatorModule,
        MatSortModule
  ],
  exports: [
    PricingRawComponent
  ]
})
export class PricingRawModule { }
