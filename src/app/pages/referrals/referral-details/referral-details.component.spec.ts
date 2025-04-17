import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralDetailsComponent } from './referral-details.component';

describe('ReferralDetailsComponent', () => {
  let component: ReferralDetailsComponent;
  let fixture: ComponentFixture<ReferralDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferralDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferralDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
