import { TestBed } from '@angular/core/testing';

import { ReferalTypeService } from './referal-type.service';

describe('ReferalTypeService', () => {
  let service: ReferalTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReferalTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
