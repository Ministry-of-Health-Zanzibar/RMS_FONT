import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillFileByIdComponent } from './bill-file-by-id.component';

describe('BillFileByIdComponent', () => {
  let component: BillFileByIdComponent;
  let fixture: ComponentFixture<BillFileByIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillFileByIdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillFileByIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
