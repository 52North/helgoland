import { Component, OnInit } from '@angular/core';

import { SelectionRange } from './../../../display/d-three-diagram/d-three-diagram.component';
import { TrajectoryService } from './../trajectory.service';

@Component({
    selector: 'n52-trajectory-view',
    templateUrl: 'view.component.html',
    styleUrls: ['view.component.scss']
})
export class TrajectoryViewComponent implements OnInit {

    public model: any;

    public selection: SelectionRange;

    public highlight: number;

    public highlightGeometry: GeoJSON.Point;

    public graphOptions = {
        axisType: 'distance'
    };

    constructor(
        private trajectorySrvc: TrajectoryService
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

}
