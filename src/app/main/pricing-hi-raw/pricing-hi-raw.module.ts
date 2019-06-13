import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, MatStepperModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';

import { PricingHiRawListComponent } from './pricing-hi-raw-list/pricing-hi-raw-list.component';
import { PricingHiRawDetailComponent } from './pricing-hi-raw-detail/pricing-hi-raw-detail.component';

const routes = [
  {
    path: 'pricing-hi-raw-list',
    component: PricingHiRawListComponent
  },
  {
    path: 'pricing-hi-raw-detail',
    component: PricingHiRawDetailComponent
  }
];
@NgModule({
  declarations: [PricingHiRawListComponent, PricingHiRawDetailComponent],
  imports: [
    RouterModule.forChild(routes),
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatStepperModule,

    FuseSharedModule,
  ]
})
export class PricingHiRawModule { }
