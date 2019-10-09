import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTrajectoryEntryComponent } from './custom-trajectory-entry.component';

describe('CustomTrajectoryEntryComponent', () => {
  let component: CustomTrajectoryEntryComponent;
  let fixture: ComponentFixture<CustomTrajectoryEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomTrajectoryEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomTrajectoryEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
