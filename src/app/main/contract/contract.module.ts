import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ContractListComponent } from './contract-list/contract-list.component';
import { ContractDetailComponent } from './contract-detail/contract-detail.component';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FuseSidebarModule } from '@fuse/components';
import { MatFormFieldModule, MatSelectModule, MatGridListModule, MatInputModule, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, MatCardModule, MatExpansionModule, MatMenuModule, MatCheckboxModule, MatRadioModule, MatDatepickerModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgxDataTableModule } from 'ngx-nested-data-table';
import { NgxMaskModule } from 'ngx-mask';

const routes = [
  {
    path: 'contract',
    component: ContractListComponent
  },
  {
    path: 'contract-detail',
    component: ContractDetailComponent
  }
];

@NgModule({
  declarations: [ContractListComponent, ContractDetailComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FuseSidebarModule,
    MatIconModule,
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
    NgxDataTableModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatRadioModule,
    NgxMaskModule.forRoot()
  ],
  exports: [
    ContractListComponent,
    ContractDetailComponent
  ]
})
export class ContractModule { }
