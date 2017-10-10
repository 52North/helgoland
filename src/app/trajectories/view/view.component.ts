import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { AxisType, D3GraphOptions } from '../../toolbox/components/graph/d3-timeseries-graph/d3-timeseries-graph.component';
import { SelectionRange } from './../../toolbox/components/display/d-three-graph/d-three-graph.component';
import { DatasetOptions } from './../../toolbox/model/api/dataset/options';
import { Timespan } from './../../toolbox/model/internal/time-interval';
import { TrajectoryModel } from './../model/trajectory-model';
import { TrajectoriesService } from './../services/trajectories.service';
import { TrajectoriesViewPermalink } from './view-permalink';

@Component({
    selector: 'n52-trajectories-view',
    templateUrl: './view.component.html',
    styleUrls: ['./view.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TrajectoriesViewComponent implements OnInit {

    public model: TrajectoryModel;

    public selection: SelectionRange;

    public highlight: number;

    public highlightGeometry: GeoJSON.Point;

    public timespan: Timespan;

    public options: Map<string, DatasetOptions>;

    public graphOptions: D3GraphOptions = {
        axisType: AxisType.Distance,
        dotted: false
    };

    public axisTypeDistance = AxisType.Distance;
    public axisTypeTime = AxisType.Time;
    public axisTypeTicks = AxisType.Ticks;

    constructor(
        private trajectorySrvc: TrajectoriesService,
        private permalinkSrvc: TrajectoriesViewPermalink
    ) { }

    public ngOnInit() {
        this.permalinkSrvc.validatePeramlink();
        this.model = this.trajectorySrvc.model;
        this.timespan = this.trajectorySrvc.timespan;
        this.options = this.trajectorySrvc.options;
    }

    onSelectionChanged(range: SelectionRange) {
        this.selection = range;
    }

    onChartHighlightChanged(idx: number) {
        this.highlight = idx;
        this.highlightGeometry = this.trajectorySrvc.getPointForIdx(idx);
    }

    onAxisTypeChanged(axisType: AxisType) {
        this.graphOptions.axisType = axisType;
    }

    onDottedChanged(dotted: boolean) {
        this.graphOptions.dotted = dotted;
    }

}
