import { TestBed } from '@angular/core/testing';

import { BillFileService } from './bill-file.service';

describe('BillFileService', () => {
  let service: BillFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BillFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
