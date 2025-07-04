import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMonthbillComponent } from './add-monthbill.component';

describe('AddMonthbillComponent', () => {
  let component: AddMonthbillComponent;
  let fixture: ComponentFixture<AddMonthbillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMonthbillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMonthbillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
