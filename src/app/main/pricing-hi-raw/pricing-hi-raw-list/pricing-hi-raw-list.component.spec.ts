import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingHiRawListComponent } from './pricing-hi-raw-list.component';

describe('PricingHiRawListComponent', () => {
  let component: PricingHiRawListComponent;
  let fixture: ComponentFixture<PricingHiRawListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PricingHiRawListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingHiRawListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
