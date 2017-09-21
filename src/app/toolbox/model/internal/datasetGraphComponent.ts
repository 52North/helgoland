import { TimeInterval, Timespan } from './time-interval';
import { EventEmitter, Input } from '@angular/core';

import { Styles } from './../api/dataset/styles';

export interface DatasetGraphComponent {

    // INPUTS

    seriesIds: Array<string>;

    selectedSeriesIds: Array<string>;

    timeInterval: TimeInterval; // oder einzeln lösen. Checken, ob Änderung einzelner property in change detection auftauchen.

    seriesOptions: StylesMap;

    diagramOptions: any;

    // OUTPUTS

    onSeriesSelected: EventEmitter<string>; // Oder Array<string>

    onTimespanChanged: EventEmitter<Timespan>;

    onMessageThrown: EventEmitter<GraphMessage>;

}

export interface StylesMap {
    [seriesId: string]: Styles;
}

export interface GraphMessage {
    type: GraphMessageType;
    message: string;
}

export enum GraphMessageType {
    ERROR,
    INFO
}
