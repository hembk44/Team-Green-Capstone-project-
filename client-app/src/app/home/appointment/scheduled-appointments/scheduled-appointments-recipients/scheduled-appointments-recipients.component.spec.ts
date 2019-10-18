import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledAppointmentsRecipientsComponent } from './scheduled-appointments-recipients.component';

describe('ScheduledAppointmentsRecipientsComponent', () => {
  let component: ScheduledAppointmentsRecipientsComponent;
  let fixture: ComponentFixture<ScheduledAppointmentsRecipientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduledAppointmentsRecipientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledAppointmentsRecipientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
