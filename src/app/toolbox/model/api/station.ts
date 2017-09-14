import { ParameterConstellation } from './dataset/parameterConstellation';
import { Parameter } from './parameter';
import { Timeseries } from './timeseries';

export class Station {

    geometry: GeoJSON.Point;

    properties: StationProperties;

}

class StationProperties extends Parameter {

    timeseries: TimeseriesCollection | Timeseries;

}

class TimeseriesCollection {

    [key: string]: ParameterConstellation;

}
