import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualStartComponent } from './manual-start.component';

describe('ManualStartComponent', () => {
  let component: ManualStartComponent;
  let fixture: ComponentFixture<ManualStartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualStartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
