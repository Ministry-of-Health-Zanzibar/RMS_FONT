import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReferralsComponent } from './add-referrals.component';

describe('AddReferralsComponent', () => {
  let component: AddReferralsComponent;
  let fixture: ComponentFixture<AddReferralsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddReferralsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddReferralsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
