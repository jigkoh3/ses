import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddendumListComponent } from './addendum-list/addendum-list.component';
import { RouterModule } from '@angular/router';
import { MatMenuModule, MatExpansionModule, MatIconModule, MatCardModule, MatButtonModule, MatSortModule, MatPaginatorModule, MatTableModule, MatInputModule, MatGridListModule, MatSelectModule, MatFormFieldModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { FuseSharedModule } from '@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';

const routes = [
  {
    path: 'Addendum',
    component: AddendumListComponent
  }
];

@NgModule({
  declarations: [AddendumListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatFormFieldModule,
    TranslateModule,
    MatSelectModule,
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
    MatMenuModule
  ],
  exports:[
    AddendumListComponent
  ]
})
export class AddendumModule { }
