import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupStartComponent } from './group-start.component';

describe('GroupStartComponent', () => {
  let component: GroupStartComponent;
  let fixture: ComponentFixture<GroupStartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupStartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
