import { TestBed } from '@angular/core/testing';

import { StarterService } from './starter.service';

describe('StarterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StarterService = TestBed.get(StarterService);
    expect(service).toBeTruthy();
  });
});
