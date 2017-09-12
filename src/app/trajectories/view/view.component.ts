import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { SelectionRange } from './../../toolbox/components/display/d-three-diagram/d-three-diagram.component';
import { TrajectoriesService } from './../services/trajectories.service';

@Component({
  selector: 'n52-trajectories-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TrajectoriesViewComponent implements OnInit {

  public model: any;

  public selection: SelectionRange;

  public highlight: number;

  public highlightGeometry: GeoJSON.Point;

  public axisType = 'distance';

  public dotted = false;

  constructor(
    private trajectorySrvc: TrajectoriesService
  ) { }

  public ngOnInit() {
    this.model = this.trajectorySrvc.model;
  }

  onSelectionChanged(range: SelectionRange) {
    this.selection = range;
  }

  onChartHighlightChanged(idx: number) {
    this.highlight = idx;
    this.highlightGeometry = this.trajectorySrvc.getPointForIdx(idx);
  }

  onAxisTypeChanged(axisType: string) {
    this.axisType = axisType;
  }

  onDottedChanged(dotted: boolean) {
    this.dotted = dotted;
  }

}
