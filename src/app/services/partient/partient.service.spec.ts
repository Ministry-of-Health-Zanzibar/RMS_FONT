import { TestBed } from '@angular/core/testing';

import { PartientService } from './partient.service';

describe('PartientService', () => {
  let service: PartientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
