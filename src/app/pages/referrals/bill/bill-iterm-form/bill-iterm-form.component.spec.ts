import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillItermFormComponent } from './bill-iterm-form.component';

describe('BillItermFormComponent', () => {
  let component: BillItermFormComponent;
  let fixture: ComponentFixture<BillItermFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillItermFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillItermFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
