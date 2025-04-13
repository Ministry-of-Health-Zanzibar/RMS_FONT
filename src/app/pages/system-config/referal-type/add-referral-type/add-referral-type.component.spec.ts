import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReferralTypeComponent } from './add-referral-type.component';

describe('AddReferralTypeComponent', () => {
  let component: AddReferralTypeComponent;
  let fixture: ComponentFixture<AddReferralTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddReferralTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddReferralTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
