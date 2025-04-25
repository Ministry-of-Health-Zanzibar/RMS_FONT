import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterReportComponent } from './parameter-report.component';

describe('ParameterReportComponent', () => {
  let component: ParameterReportComponent;
  let fixture: ComponentFixture<ParameterReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParameterReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParameterReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
