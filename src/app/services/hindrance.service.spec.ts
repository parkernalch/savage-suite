import { TestBed } from '@angular/core/testing';

import { HindranceService } from './hindrance.service';

describe('HindranceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HindranceService = TestBed.get(HindranceService);
    expect(service).toBeTruthy();
  });
});
