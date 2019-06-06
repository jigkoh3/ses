import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddendumListComponent } from './addendum-list.component';

describe('AddendumListComponent', () => {
  let component: AddendumListComponent;
  let fixture: ComponentFixture<AddendumListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddendumListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddendumListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
