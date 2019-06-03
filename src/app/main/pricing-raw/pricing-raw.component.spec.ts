import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingRawComponent } from './pricing-raw.component';

describe('PricingRawComponent', () => {
  let component: PricingRawComponent;
  let fixture: ComponentFixture<PricingRawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PricingRawComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingRawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
