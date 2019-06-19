import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingTransFormComponent } from './pricing-trans-form.component';

describe('PricingTransFormComponent', () => {
  let component: PricingTransFormComponent;
  let fixture: ComponentFixture<PricingTransFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PricingTransFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingTransFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
