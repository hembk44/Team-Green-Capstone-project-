import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BroadcastManagementComponent } from './broadcast-management.component';

describe('BroadcastManagementComponent', () => {
  let component: BroadcastManagementComponent;
  let fixture: ComponentFixture<BroadcastManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BroadcastManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BroadcastManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
