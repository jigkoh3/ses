import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingWhiteDetailComponent } from './pricing-white-detail.component';

describe('PricingWhiteDetailComponent', () => {
  let component: PricingWhiteDetailComponent;
  let fixture: ComponentFixture<PricingWhiteDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PricingWhiteDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingWhiteDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
