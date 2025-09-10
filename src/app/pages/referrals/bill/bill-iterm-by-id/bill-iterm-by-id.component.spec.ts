import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillItermByIdComponent } from './bill-iterm-by-id.component';

describe('BillItermByIdComponent', () => {
  let component: BillItermByIdComponent;
  let fixture: ComponentFixture<BillItermByIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillItermByIdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillItermByIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
