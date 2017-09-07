import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeseriesNavigationComponent } from './timeseries-navigation.component';

describe('TimeseriesNavigationComponent', () => {
  let component: TimeseriesNavigationComponent;
  let fixture: ComponentFixture<TimeseriesNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeseriesNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeseriesNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
