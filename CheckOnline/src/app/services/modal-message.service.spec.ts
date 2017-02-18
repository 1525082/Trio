/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ModalMessageService } from './modal-message.service';

describe('ModalMessageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModalMessageService]
    });
  });

  it('should ...', inject([ModalMessageService], (service: ModalMessageService) => {
    expect(service).toBeTruthy();
  }));
});
