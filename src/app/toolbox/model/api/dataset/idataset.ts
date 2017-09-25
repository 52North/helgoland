import { Parameter } from './../parameter';
import { FirstLastValue } from './firstLastValue';
import { ParameterConstellation } from './parameterConstellation';
import { Styles } from './styles';

export interface IDataset extends Parameter {
    url: string;
    uom: string;
    internalId: string;
    firstValue: FirstLastValue;
    lastValue: FirstLastValue;
    parameters: ParameterConstellation;
    hasData: boolean;
}
