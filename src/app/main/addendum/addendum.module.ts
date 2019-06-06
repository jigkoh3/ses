import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddendumListComponent } from './addendum-list/addendum-list.component';
import { RouterModule } from '@angular/router';
import { MatMenuModule, MatExpansionModule, MatIconModule, MatCardModule, MatButtonModule, MatSortModule, MatPaginatorModule, MatTableModule, MatInputModule, MatGridListModule, MatSelectModule, MatFormFieldModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { FuseSharedModule } from '@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { AddendumDetailComponent } from './addendum-detail/addendum-detail.component';

const routes = [
  {
    path: 'Addendum',
    component: AddendumListComponent
  },{
    path: 'Addendum-detail',
    component: AddendumDetailComponent
  }
];

@NgModule({
  declarations: [AddendumListComponent, AddendumDetailComponent],
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
