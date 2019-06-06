import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricingWhiteListComponent } from './pricing-white-list/pricing-white-list.component';
import { RouterModule } from '@angular/router';
const routes = [
  {
    path: 'pricing-white',
    component: PricingWhiteListComponent
  }
];
@NgModule({
  declarations: [PricingWhiteListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    PricingWhiteListComponent
  ]
})
export class PricingWhiteModule { }
