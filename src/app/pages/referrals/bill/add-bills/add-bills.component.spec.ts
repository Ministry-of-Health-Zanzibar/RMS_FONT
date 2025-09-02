import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBillsComponent } from './add-bills.component';

describe('AddBillsComponent', () => {
  let component: AddBillsComponent;
  let fixture: ComponentFixture<AddBillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBillsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
