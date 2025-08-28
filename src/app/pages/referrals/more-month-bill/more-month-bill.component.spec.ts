import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreMonthBillComponent } from './more-month-bill.component';

describe('MoreMonthBillComponent', () => {
  let component: MoreMonthBillComponent;
  let fixture: ComponentFixture<MoreMonthBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoreMonthBillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoreMonthBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
