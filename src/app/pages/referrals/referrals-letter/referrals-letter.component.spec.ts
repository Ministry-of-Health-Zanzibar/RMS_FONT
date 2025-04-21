import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralsLetterComponent } from './referrals-letter.component';

describe('ReferralsLetterComponent', () => {
  let component: ReferralsLetterComponent;
  let fixture: ComponentFixture<ReferralsLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferralsLetterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferralsLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
