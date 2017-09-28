import { IDataset } from './dataset/idataset';
import { PlatformTypes } from './dataset/platformTypes';
import { Parameter } from './parameter';

export class Platform extends Parameter {

    platformType: PlatformTypes;

    datasets: Array<IDataset>;

    geometry: GeoJSON.Point;

}
