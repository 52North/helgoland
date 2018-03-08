import { TestBed, inject } from '@angular/core/testing';

import { TrajectoriesService } from './trajectories.service';

describe('TrajectoriesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrajectoriesService]
    });
  });

  it('should be created', inject([TrajectoriesService], (service: TrajectoriesService) => {
    expect(service).toBeTruthy();
  }));
});
