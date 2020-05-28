import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimezoneSelectorComponent } from './timezone-selector.component';

describe('TimezoneSelectorComponent', () => {
  let component: TimezoneSelectorComponent;
  let fixture: ComponentFixture<TimezoneSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimezoneSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimezoneSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
