import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralrangereportComponent } from './referralrangereport.component';

describe('ReferralrangereportComponent', () => {
  let component: ReferralrangereportComponent;
  let fixture: ComponentFixture<ReferralrangereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferralrangereportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferralrangereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
