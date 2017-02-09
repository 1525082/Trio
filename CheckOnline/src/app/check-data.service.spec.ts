/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CheckDataService } from './check-data.service';

describe('CheckDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CheckDataService]
    });
  });

  it('should ...', inject([CheckDataService], (service: CheckDataService) => {
    expect(service).toBeTruthy();
  }));
});
