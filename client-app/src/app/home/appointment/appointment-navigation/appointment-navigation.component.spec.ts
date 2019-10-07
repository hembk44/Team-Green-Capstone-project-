import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentNavigationComponent } from './appointment-navigation.component';

describe('AppointmentNavigationComponent', () => {
  let component: AppointmentNavigationComponent;
  let fixture: ComponentFixture<AppointmentNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
