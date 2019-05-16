import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DefinedTimespanService } from '@helgoland/core';

import { CustomTimespanButtonComponent } from './custom-timespan-button.component';

describe('TimespanButtonComponent', () => {
  let component: CustomTimespanButtonComponent;
  let fixture: ComponentFixture<CustomTimespanButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        DefinedTimespanService
      ],
      declarations: [CustomTimespanButtonComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomTimespanButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
