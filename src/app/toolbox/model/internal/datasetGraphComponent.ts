import { EventEmitter } from '@angular/core';

import { DatasetOptions } from './../api/dataset/options';
import { TimeInterval, Timespan } from './time-interval';

export interface DatasetGraphComponent {

    // INPUTS

    seriesIds: Array<string>;

    selectedSeriesIds: Array<string>;

    timeInterval: TimeInterval; // oder einzeln lösen. Checken, ob Änderung einzelner property in change detection auftauchen.

    seriesOptions: Map<string, DatasetOptions>;

    graphOptions: any;

    // OUTPUTS

    onSeriesSelected: EventEmitter<string>; // Oder Array<string>

    onTimespanChanged: EventEmitter<Timespan>;

    onMessageThrown: EventEmitter<GraphMessage>;

}

export interface GraphMessage {
    type: GraphMessageType;
    message: string;
}

export enum GraphMessageType {
    ERROR,
    INFO
}
