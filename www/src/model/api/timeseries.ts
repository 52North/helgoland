import { Parameter } from './parameter';
import { Dataset } from './dataset';

export class Timeseries extends Dataset {

    parameter: TimeseriesParameterConstellation;

}

export class TimeseriesParameterConstellation {

    service: Parameter;

    offering: Parameter;

    feature: Parameter;

    procedure: Parameter;

    phenomenon: Parameter;

    category: Parameter;

    loading?: boolean;

}
