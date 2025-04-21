import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralpaymentComponent } from './referralpayment.component';

describe('ReferralpaymentComponent', () => {
  let component: ReferralpaymentComponent;
  let fixture: ComponentFixture<ReferralpaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferralpaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferralpaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
