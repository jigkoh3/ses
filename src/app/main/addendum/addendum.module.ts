import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddendumListComponent } from './addendum-list/addendum-list.component';
import { RouterModule } from '@angular/router';

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
  ],
  exports:[
    AddendumListComponent
  ]
})
export class AddendumModule { }
