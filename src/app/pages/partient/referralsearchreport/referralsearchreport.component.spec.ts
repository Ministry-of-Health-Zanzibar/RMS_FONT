import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralsearchreportComponent } from './referralsearchreport.component';

describe('ReferralsearchreportComponent', () => {
  let component: ReferralsearchreportComponent;
  let fixture: ComponentFixture<ReferralsearchreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferralsearchreportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferralsearchreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
