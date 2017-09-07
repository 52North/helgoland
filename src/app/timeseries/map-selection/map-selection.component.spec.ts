import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapSelectionComponent } from './map-selection.component';

describe('MapSelectionComponent', () => {
  let component: MapSelectionComponent;
  let fixture: ComponentFixture<MapSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
