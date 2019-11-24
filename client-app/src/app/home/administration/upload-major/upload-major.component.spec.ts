import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadMajorComponent } from './upload-major.component';

describe('UploadMajorComponent', () => {
  let component: UploadMajorComponent;
  let fixture: ComponentFixture<UploadMajorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadMajorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadMajorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
