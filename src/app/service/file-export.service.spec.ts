import { TestBed, inject } from '@angular/core/testing';

import { FileExportService } from './file-export.service';

describe('FileExportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FileExportService]
    });
  });

  it('should be created', inject([FileExportService], (service: FileExportService) => {
    expect(service).toBeTruthy();
  }));
});
