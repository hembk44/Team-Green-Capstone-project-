import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarCreateComponent } from './calendar-create.component';

describe('CalendarCreateComponent', () => {
  let component: CalendarCreateComponent;
  let fixture: ComponentFixture<CalendarCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
