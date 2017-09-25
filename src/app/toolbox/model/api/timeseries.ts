import { FirstLastValue } from './dataset/firstLastValue';
import { IDataset } from './dataset/idataset';
import { ParameterConstellation } from './dataset/parameterConstellation';
import { Styles } from './dataset/styles';
import { Parameter } from './parameter';
import { Station } from './station';

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
