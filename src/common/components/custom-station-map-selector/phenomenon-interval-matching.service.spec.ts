import { TestBed } from '@angular/core/testing';

import { PhenomenonIntervalMatchingService } from './phenomenon-interval-matching.service';

describe('PhenomenonIntervalMatchingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PhenomenonIntervalMatchingService = TestBed.get(PhenomenonIntervalMatchingService);
    expect(service).toBeTruthy();
  });
});
