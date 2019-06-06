import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddendumDetailComponent } from './addendum-detail.component';

describe('AddendumDetailComponent', () => {
  let component: AddendumDetailComponent;
  let fixture: ComponentFixture<AddendumDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddendumDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddendumDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
