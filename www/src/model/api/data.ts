import { IDataEntry } from './data';
// tslint:disable-next-line:no-empty-interface
export interface IDataEntry {}

export interface Data<T extends IDataEntry> {
    values: Array<T>;
}

export interface TimeValueEntry extends IDataEntry {
    timestamp: number;
    value: number;
}

export interface LocatedTimeValueEntry extends IDataEntry {
    timestamp: number;
    value: number;
    geometry: GeoJSON.Point;
}
