import { Parameter } from './parameter';

export class Dataset extends Parameter {

    url: string;

    datasetType?: PlatformTypes;

    valueType?: ValueTypes;

}

export enum PlatformTypes {
    stationary,
    mobile
}

export enum ValueTypes {
    quantity
}
