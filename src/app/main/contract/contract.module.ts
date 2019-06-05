import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ContractListComponent } from './contract-list/contract-list.component';
import { ContractDetailComponent } from './contract-detail/contract-detail.component';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FuseSidebarModule } from '@fuse/components';
const routes = [
  {
    path: 'contracts',
    component: ContractListComponent
  },
  {
    path: 'contract',
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
    MatIconModule
  ],
  exports: [
    ContractListComponent,
    ContractDetailComponent
  ]
})
export class ContractModule { }
