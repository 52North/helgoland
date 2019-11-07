import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTimeRangeSliderComponent } from './custom-time-range-slider.component';

describe('CustomTimeRangeSliderComponent', () => {
  let component: CustomTimeRangeSliderComponent;
  let fixture: ComponentFixture<CustomTimeRangeSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomTimeRangeSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomTimeRangeSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
