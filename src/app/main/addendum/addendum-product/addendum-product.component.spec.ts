import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddendumProductComponent } from './addendum-product.component';

describe('AddendumProductComponent', () => {
  let component: AddendumProductComponent;
  let fixture: ComponentFixture<AddendumProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddendumProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddendumProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
