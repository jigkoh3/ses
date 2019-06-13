import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingHiRawDetailComponent } from './pricing-hi-raw-detail.component';

describe('PricingHiRawDetailComponent', () => {
  let component: PricingHiRawDetailComponent;
  let fixture: ComponentFixture<PricingHiRawDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PricingHiRawDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingHiRawDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
