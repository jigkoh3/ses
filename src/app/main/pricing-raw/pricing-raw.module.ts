import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule, MatPaginatorModule, MatSortModule, } from '@angular/material'
import { PricingRawListComponent } from './pricing-raw-list/pricing-raw-list.component';
import { PricingRawDetailComponent } from './pricing-raw-detail/pricing-raw-detail.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';

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
    MatFormFieldModule,
    TranslateModule,
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
    MatCardModule
  ],
  exports: [
    PricingRawListComponent,
    PricingRawDetailComponent
  ]
})
export class PricingRawModule { }
