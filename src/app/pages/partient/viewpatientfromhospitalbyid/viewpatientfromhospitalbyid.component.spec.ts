import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewpatientfromhospitalbyidComponent } from './viewpatientfromhospitalbyid.component';

describe('ViewpatientfromhospitalbyidComponent', () => {
  let component: ViewpatientfromhospitalbyidComponent;
  let fixture: ComponentFixture<ViewpatientfromhospitalbyidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewpatientfromhospitalbyidComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewpatientfromhospitalbyidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
