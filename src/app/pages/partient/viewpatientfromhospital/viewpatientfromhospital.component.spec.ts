import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewpatientfromhospitalComponent } from './viewpatientfromhospital.component';

describe('ViewpatientfromhospitalComponent', () => {
  let component: ViewpatientfromhospitalComponent;
  let fixture: ComponentFixture<ViewpatientfromhospitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewpatientfromhospitalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewpatientfromhospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
