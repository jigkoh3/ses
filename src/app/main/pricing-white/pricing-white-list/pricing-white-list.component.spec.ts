import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingWhiteListComponent } from './pricing-white-list.component';

describe('PricingWhiteListComponent', () => {
  let component: PricingWhiteListComponent;
  let fixture: ComponentFixture<PricingWhiteListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PricingWhiteListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingWhiteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
