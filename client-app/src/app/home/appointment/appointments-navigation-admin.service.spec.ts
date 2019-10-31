import { TestBed } from '@angular/core/testing';

import { AppointmentsNavigationAdminService } from './appointments-navigation-admin.service';

describe('AppointmentsNavigationAdminService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppointmentsNavigationAdminService = TestBed.get(AppointmentsNavigationAdminService);
    expect(service).toBeTruthy();
  });
});
