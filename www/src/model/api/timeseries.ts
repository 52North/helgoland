import { Parameter } from './parameter';
import { Station } from './station';
import { FirstLastValue, IDataset, Styles, ParameterConstellation } from './dataset';

export class Timeseries extends Parameter implements IDataset {
    url: string;
    uom: string;
    firstValue: FirstLastValue;
    lastValue: FirstLastValue;
    station: Station;
    parameters: ParameterConstellation;
    styles = new Styles();
}
