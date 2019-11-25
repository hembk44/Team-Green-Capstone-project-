import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrdcastComponent } from './brdcast.component';

describe('BrdcastComponent', () => {
  let component: BrdcastComponent;
  let fixture: ComponentFixture<BrdcastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrdcastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrdcastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
