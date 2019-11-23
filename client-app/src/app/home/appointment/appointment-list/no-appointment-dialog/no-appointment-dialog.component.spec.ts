import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoAppointmentDialogComponent } from './no-appointment-dialog.component';

describe('NoAppointmentDialogComponent', () => {
  let component: NoAppointmentDialogComponent;
  let fixture: ComponentFixture<NoAppointmentDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoAppointmentDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoAppointmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
