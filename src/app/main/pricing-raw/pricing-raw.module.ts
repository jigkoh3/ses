import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatTableModule, MatPaginatorModule, MatSortModule } from '@angular/material'
import { PricingRawListComponent } from './pricing-raw-list/pricing-raw-list.component';
import { PricingRawDetailComponent } from './pricing-raw-detail/pricing-raw-detail.component';

const routes = [
  {
    path: 'pricing-raw',
    component: PricingRawListComponent
  },
  {
    path: 'pricing-Detail',
    component: PricingRawDetailComponent
  }
];

@NgModule({
  declarations: [
    PricingRawListComponent,
    PricingRawDetailComponent
  ],
  imports: [
    RouterModule.forChild(routes),

    TranslateModule,

    FuseSharedModule,
    MatGridListModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  exports: [
    PricingRawListComponent,
    PricingRawDetailComponent
  ]
})
export class PricingRawModule { }
