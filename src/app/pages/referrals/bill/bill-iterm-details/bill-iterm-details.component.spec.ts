import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillItermDetailsComponent } from './bill-iterm-details.component';

describe('BillItermDetailsComponent', () => {
  let component: BillItermDetailsComponent;
  let fixture: ComponentFixture<BillItermDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillItermDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillItermDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
