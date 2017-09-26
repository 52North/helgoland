import { ParameterConstellation } from './dataset/parameterConstellation';
import { Timeseries } from './dataset/timeseries';
import { Parameter } from './parameter';

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
