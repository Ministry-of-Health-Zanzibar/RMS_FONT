import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignUserHospitalComponent } from './assign-user-hospital.component';

describe('AssignUserHospitalComponent', () => {
  let component: AssignUserHospitalComponent;
  let fixture: ComponentFixture<AssignUserHospitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignUserHospitalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignUserHospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
