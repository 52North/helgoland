import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotlyProfileGraphComponent } from './plotly-profile-graph.component';

describe('PlotlyProfileGraphComponent', () => {
  let component: PlotlyProfileGraphComponent;
  let fixture: ComponentFixture<PlotlyProfileGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlotlyProfileGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlotlyProfileGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
