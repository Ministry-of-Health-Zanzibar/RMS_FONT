import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillFillByHospitalComponent } from './bill-fill-by-hospital.component';

describe('BillFillByHospitalComponent', () => {
  let component: BillFillByHospitalComponent;
  let fixture: ComponentFixture<BillFillByHospitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillFillByHospitalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillFillByHospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
