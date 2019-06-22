import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ContractListComponent } from './contract-list/contract-list.component';
import { ContractDetailComponent } from './contract-detail/contract-detail.component';
import { ContractItemComponent } from './contract-detail/contract-item.component';
import { AddendumDetailComponent } from './addendum-detail/addendum-detail.component';
import { ContextMenuComponent } from './context-menu.component';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FuseSidebarModule } from '@fuse/components';
import {
  MatFormFieldModule,
  MatSelectModule,
  MatGridListModule,
  MatInputModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatButtonModule,
  MatCardModule,
  MatExpansionModule,
  MatMenuModule,
  MatCheckboxModule,
  MatRadioModule,
  MatDatepickerModule,
  MatDialogModule,
  MatTabsModule,
  MatSnackBarModule,
  MatProgressBarModule
} from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgxDataTableModule } from 'ngx-nested-data-table';
import { NgxMaskModule } from 'ngx-mask';
import { FuseConfirmDialogModule } from '@fuse/components';
import { AddendumItemComponent } from './addendum-detail/addendum-item.component';

const routes = [
  {
    path: 'contract',
    component: ContractListComponent
  },
  {
    path: 'contract-detail',
    component: ContractDetailComponent
  },
  {
    path: 'contract-detail/:id',
    component: ContractDetailComponent
  }
  ,
  {
    path: 'addendum-detail',
    component: AddendumDetailComponent
  },
  {
    path: 'addendum-detail/:id',
    component: AddendumDetailComponent
  }
];

@NgModule({
  declarations: [
    ContractListComponent,
    ContractDetailComponent,
    ContractItemComponent,
    ContextMenuComponent,
    AddendumDetailComponent,
    AddendumItemComponent],
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
    MatDialogModule,
    MatSnackBarModule,
    MatTabsModule,
    MatProgressBarModule,
    FuseConfirmDialogModule,
    NgxMaskModule.forRoot()
  ],
  exports: [
    ContractListComponent,
    ContractDetailComponent,
    ContractItemComponent,
    AddendumDetailComponent,
    AddendumItemComponent
  ],
  entryComponents: [ContractItemComponent,AddendumItemComponent]
})
export class ContractModule { }
