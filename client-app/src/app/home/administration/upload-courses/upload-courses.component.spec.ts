import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadCoursesComponent } from './upload-courses.component';

describe('UploadCoursesComponent', () => {
  let component: UploadCoursesComponent;
  let fixture: ComponentFixture<UploadCoursesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadCoursesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
