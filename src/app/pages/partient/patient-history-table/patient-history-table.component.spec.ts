import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientHistoryTableComponent } from './patient-history-table.component';

describe('PatientHistoryTableComponent', () => {
  let component: PatientHistoryTableComponent;
  let fixture: ComponentFixture<PatientHistoryTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientHistoryTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientHistoryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
