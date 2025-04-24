import { TestBed } from '@angular/core/testing';

import { SourceTypeService } from './source-type.service';

describe('SourceTypeService', () => {
  let service: SourceTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SourceTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
