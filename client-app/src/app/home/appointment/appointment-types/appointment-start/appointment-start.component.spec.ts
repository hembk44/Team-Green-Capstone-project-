import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentStartComponent } from './appointment-start.component';

describe('AppointmentStartComponent', () => {
  let component: AppointmentStartComponent;
  let fixture: ComponentFixture<AppointmentStartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentStartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
