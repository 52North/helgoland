import { EventEmitter } from '@angular/core';

import { DatasetOptions } from './../api/dataset/options';
import { TimeInterval, Timespan } from './time-interval';

export interface DatasetGraphComponent {

    // INPUTS

    datasetIds: Array<string>;

    selectedDatasetIds: Array<string>;

    timeInterval: TimeInterval; // oder einzeln lösen. Checken, ob Änderung einzelner property in change detection auftauchen.

    datasetOptions: Map<string, DatasetOptions>;

    graphOptions: any;

    // OUTPUTS

    onDatasetSelected: EventEmitter<Array<string>>;

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
