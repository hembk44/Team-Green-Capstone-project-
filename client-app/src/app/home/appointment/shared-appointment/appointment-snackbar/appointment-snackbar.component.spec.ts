import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentSnackbarComponent } from './appointment-snackbar.component';

describe('AppointmentSnackbarComponent', () => {
  let component: AppointmentSnackbarComponent;
  let fixture: ComponentFixture<AppointmentSnackbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentSnackbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
