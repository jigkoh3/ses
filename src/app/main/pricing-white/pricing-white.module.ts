import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricingWhiteListComponent } from './pricing-white-list/pricing-white-list.component';
import { RouterModule } from '@angular/router';
import { PricingWhiteDetailComponent } from './pricing-white-detail/pricing-white-detail.component';
import { MatFormFieldModule, MatSelectModule, MatGridListModule, MatInputModule, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, MatCardModule, MatIconModule, MatExpansionModule, MatMenuModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { FormsModule } from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
const routes = [
  {
    path: 'pricingwhite',
    component: PricingWhiteListComponent
  },
  {
    path: 'pricing-white-detail',
    component: PricingWhiteDetailComponent
  }
];
@NgModule({
  declarations: [
    PricingWhiteListComponent,
    PricingWhiteDetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatFormFieldModule,
    MatSelectModule,
    TranslateModule,
    FuseSharedModule,
    MatGridListModule,
    MatInputModule,
    MatTableModule,
    FormsModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatExpansionModule,
    MatMenuModule,
    MatCheckboxModule
  ],
  exports: [
    PricingWhiteListComponent,
    PricingWhiteDetailComponent
  ]
})
export class PricingWhiteModule { }
