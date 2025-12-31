import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualreportComponent } from './individualreport.component';

describe('IndividualreportComponent', () => {
  let component: IndividualreportComponent;
  let fixture: ComponentFixture<IndividualreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndividualreportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndividualreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
