import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralStatusDialogComponent } from './referral-status-dialog.component';

describe('ReferralStatusDialogComponent', () => {
  let component: ReferralStatusDialogComponent;
  let fixture: ComponentFixture<ReferralStatusDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferralStatusDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferralStatusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
