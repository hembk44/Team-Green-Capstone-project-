import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentItemComponent } from './appointment-item.component';

describe('AppointmentItemComponent', () => {
  let component: AppointmentItemComponent;
  let fixture: ComponentFixture<AppointmentItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
