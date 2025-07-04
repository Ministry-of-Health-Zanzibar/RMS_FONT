import { TestBed } from '@angular/core/testing';

import { ReferralreportService } from './referralreport.service';

describe('ReferralreportService', () => {
  let service: ReferralreportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReferralreportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
