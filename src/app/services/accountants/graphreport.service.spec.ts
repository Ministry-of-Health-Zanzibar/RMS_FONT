import { TestBed } from '@angular/core/testing';

import { GraphreportService } from './graphreport.service';

describe('GraphreportService', () => {
  let service: GraphreportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphreportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
