import { Parameter } from './parameter';

export interface IDataset extends Parameter {
    url: string;
    uom: string;
    firstValue: FirstLastValue;
    lastValue: FirstLastValue;
    parameters: ParameterConstellation;
    styles: Styles;
    data?: any;
}

export class FirstLastValue {
    timestamp: number;
    value: number;
}

export enum PlatformTypes {
    stationary,
    mobile
}

export enum DatasetType {
    measurement
}

export enum ValueTypes {
    quantity
}

export class ParameterConstellation {
    service: Parameter;
    offering: Parameter;
    feature: Parameter;
    procedure: Parameter;
    phenomenon: Parameter;
    category: Parameter;
}

export class DatasetParameterConstellation extends ParameterConstellation {
    platform: PlatformParameter;
}

export class Styles {
    selected = false;
    color = '#FF0000';
    visible = true;
    loading = false;
}

export class Dataset extends Parameter implements IDataset {
    url: string;
    uom: string;
    firstValue: FirstLastValue;
    lastValue: FirstLastValue;
    datasetType: DatasetType;
    parameters: DatasetParameterConstellation;
    styles = new Styles();
    data?: any;
}

export class PlatformParameter extends Parameter {
    platformType: PlatformTypes;
}
