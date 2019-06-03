import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingRawListComponent } from './pricing-raw-list.component';

describe('PricingRawListComponent', () => {
  let component: PricingRawListComponent;
  let fixture: ComponentFixture<PricingRawListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PricingRawListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingRawListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
