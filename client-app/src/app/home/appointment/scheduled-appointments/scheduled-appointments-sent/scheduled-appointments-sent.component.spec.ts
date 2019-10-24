import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledAppointmentsSentComponent } from './scheduled-appointments-sent.component';

describe('ScheduledAppointmentsSentComponent', () => {
  let component: ScheduledAppointmentsSentComponent;
  let fixture: ComponentFixture<ScheduledAppointmentsSentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduledAppointmentsSentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledAppointmentsSentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
