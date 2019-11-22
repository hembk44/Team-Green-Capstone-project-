import { TestBed } from '@angular/core/testing';

import { AppointmentDataCommunicationService } from './appointment-data-communication.service';

describe('AppointmentDataCommunicationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppointmentDataCommunicationService = TestBed.get(AppointmentDataCommunicationService);
    expect(service).toBeTruthy();
  });
});
