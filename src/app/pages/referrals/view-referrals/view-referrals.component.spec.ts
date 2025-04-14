import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReferralsComponent } from './view-referrals.component';

describe('ViewReferralsComponent', () => {
  let component: ViewReferralsComponent;
  let fixture: ComponentFixture<ViewReferralsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewReferralsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewReferralsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
