import { Parameter, TimeseriesParameterConstellation, Timeseries } from '../.';

export class Station {

    geometry: GeoJSON.Point;

    properties: StationProperties;

}

class StationProperties extends Parameter {

    timeseries: TimeseriesCollection | Timeseries;

}

class TimeseriesCollection {

    [key: string]: TimeseriesParameterConstellation;

}
