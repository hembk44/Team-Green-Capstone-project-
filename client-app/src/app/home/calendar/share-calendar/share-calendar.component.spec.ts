import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareCalendarComponent } from './share-calendar.component';

describe('ShareCalendarComponent', () => {
  let component: ShareCalendarComponent;
  let fixture: ComponentFixture<ShareCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
