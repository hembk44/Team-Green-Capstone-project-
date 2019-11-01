import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterUsersComponent } from './register-users.component';

describe('RegisterUsersComponent', () => {
  let component: RegisterUsersComponent;
  let fixture: ComponentFixture<RegisterUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
