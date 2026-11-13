import { TestBed, inject } from '@angular/core/testing';
import { ColorService, LocalStorage } from '@helgoland/core';

import { TrajectoriesService } from './trajectories.service';

describe('TrajectoriesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrajectoriesService, LocalStorage, ColorService]
    });
  });

  it('should be created', inject([TrajectoriesService], (service: TrajectoriesService) => {
    expect(service).toBeTruthy();
  }));
});
