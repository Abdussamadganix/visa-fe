import { TestBed } from '@angular/core/testing';

import { PgSetupService } from './pg-setup.service';

describe('PgSetupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PgSetupService = TestBed.get(PgSetupService);
    expect(service).toBeTruthy();
  });
});
