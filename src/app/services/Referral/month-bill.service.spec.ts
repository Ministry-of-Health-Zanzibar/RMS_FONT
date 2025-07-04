import { TestBed } from '@angular/core/testing';

import { MonthBillService } from './month-bill.service';

describe('MonthBillService', () => {
  let service: MonthBillService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonthBillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
