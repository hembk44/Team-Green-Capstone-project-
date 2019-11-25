import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApptComponent } from './appt.component';

describe('ApptComponent', () => {
  let component: ApptComponent;
  let fixture: ComponentFixture<ApptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
