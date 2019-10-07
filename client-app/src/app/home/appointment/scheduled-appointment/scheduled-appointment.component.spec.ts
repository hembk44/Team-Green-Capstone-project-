import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledAppointmentComponent } from './scheduled-appointment.component';

describe('ScheduledAppointmentComponent', () => {
  let component: ScheduledAppointmentComponent;
  let fixture: ComponentFixture<ScheduledAppointmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduledAppointmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
