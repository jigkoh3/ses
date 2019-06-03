import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingRawDetailComponent } from './pricing-raw-detail.component';

describe('PricingRawDetailComponent', () => {
  let component: PricingRawDetailComponent;
  let fixture: ComponentFixture<PricingRawDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PricingRawDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingRawDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
