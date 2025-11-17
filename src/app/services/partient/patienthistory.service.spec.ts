import { TestBed } from '@angular/core/testing';

import { PatienthistoryService } from './patienthistory.service';

describe('PatienthistoryService', () => {
  let service: PatienthistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatienthistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
