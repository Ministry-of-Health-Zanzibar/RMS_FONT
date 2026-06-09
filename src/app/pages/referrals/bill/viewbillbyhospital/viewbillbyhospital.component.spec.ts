import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewbillbyhospitalComponent } from './viewbillbyhospital.component';

describe('ViewbillbyhospitalComponent', () => {
  let component: ViewbillbyhospitalComponent;
  let fixture: ComponentFixture<ViewbillbyhospitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewbillbyhospitalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewbillbyhospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
