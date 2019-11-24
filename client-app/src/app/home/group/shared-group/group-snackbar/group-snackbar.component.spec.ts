import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupSnackbarComponent } from './group-snackbar.component';

describe('GroupSnackbarComponent', () => {
  let component: GroupSnackbarComponent;
  let fixture: ComponentFixture<GroupSnackbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupSnackbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
