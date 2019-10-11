import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentReceivedComponent } from './appointment-received.component';

describe('AppointmentReceivedComponent', () => {
  let component: AppointmentReceivedComponent;
  let fixture: ComponentFixture<AppointmentReceivedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentReceivedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentReceivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
