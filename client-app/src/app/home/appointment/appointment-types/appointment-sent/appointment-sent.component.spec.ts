import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentSentComponent } from './appointment-sent.component';

describe('AppointmentSentComponent', () => {
  let component: AppointmentSentComponent;
  let fixture: ComponentFixture<AppointmentSentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentSentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentSentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
