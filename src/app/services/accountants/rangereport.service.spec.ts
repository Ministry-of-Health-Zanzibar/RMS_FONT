import { TestBed } from '@angular/core/testing';

import { RangereportService } from './rangereport.service';

describe('RangereportService', () => {
  let service: RangereportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RangereportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
