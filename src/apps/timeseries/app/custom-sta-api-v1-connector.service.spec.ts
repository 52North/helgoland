import { TestBed } from '@angular/core/testing';

import { CustomStaApiV1ConnectorService } from './custom-sta-api-v1-connector.service';

describe('CustomStaApiV1ConnectorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomStaApiV1ConnectorService = TestBed.get(CustomStaApiV1ConnectorService);
    expect(service).toBeTruthy();
  });
});
