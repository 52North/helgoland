import { inject, TestBed } from '@angular/core/testing';

import { PermalinkModalOpenerService } from './permalink-modal-opener.service';

describe('PermalinkModalOpenerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PermalinkModalOpenerService]
    });
  });

  it('should be created', inject([PermalinkModalOpenerService], (service: PermalinkModalOpenerService) => {
    expect(service).toBeTruthy();
  }));
});
