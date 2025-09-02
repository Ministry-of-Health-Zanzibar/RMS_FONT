import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillFileFormComponent } from './bill-file-form.component';

describe('BillFileFormComponent', () => {
  let component: BillFileFormComponent;
  let fixture: ComponentFixture<BillFileFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillFileFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillFileFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
