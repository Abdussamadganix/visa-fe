import { TestBed, async, inject } from '@angular/core/testing';

import { PermisionsGuard } from './permisions.guard';

describe('PermisionsGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PermisionsGuard]
    });
  });

  it('should ...', inject([PermisionsGuard], (guard: PermisionsGuard) => {
    expect(guard).toBeTruthy();
  }));
});
