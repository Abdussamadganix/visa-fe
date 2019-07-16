import { TestBed, async, inject } from '@angular/core/testing';

import { PageFrameGuard } from './page-frame.guard';

describe('PageFrameGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PageFrameGuard]
    });
  });

  it('should ...', inject([PageFrameGuard], (guard: PageFrameGuard) => {
    expect(guard).toBeTruthy();
  }));
});
