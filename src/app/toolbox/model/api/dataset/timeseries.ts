import { Parameter } from './../parameter';
import { Station } from './../station';
import { FirstLastValue } from './firstLastValue';
import { IDataset } from './idataset';
import { ParameterConstellation } from './parameterConstellation';

export class Timeseries extends Parameter implements IDataset {
    url: string;
    uom: string;
    internalId: string;
    firstValue: FirstLastValue;
    lastValue: FirstLastValue;
    station: Station;
    parameters: ParameterConstellation;
    hasData = false;
}
