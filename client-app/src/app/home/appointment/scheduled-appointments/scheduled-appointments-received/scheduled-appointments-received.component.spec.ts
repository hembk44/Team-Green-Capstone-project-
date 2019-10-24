import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledAppointmentsReceivedComponent } from './scheduled-appointments-received.component';

describe('ScheduledAppointmentsReceivedComponent', () => {
  let component: ScheduledAppointmentsReceivedComponent;
  let fixture: ComponentFixture<ScheduledAppointmentsReceivedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduledAppointmentsReceivedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledAppointmentsReceivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
