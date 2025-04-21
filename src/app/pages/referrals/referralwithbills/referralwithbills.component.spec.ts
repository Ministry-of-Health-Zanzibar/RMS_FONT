import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralwithbillsComponent } from './referralwithbills.component';

describe('ReferralwithbillsComponent', () => {
  let component: ReferralwithbillsComponent;
  let fixture: ComponentFixture<ReferralwithbillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferralwithbillsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferralwithbillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
