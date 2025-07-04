import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillwithpaymentComponent } from './billwithpayment.component';

describe('BillwithpaymentComponent', () => {
  let component: BillwithpaymentComponent;
  let fixture: ComponentFixture<BillwithpaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillwithpaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillwithpaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
