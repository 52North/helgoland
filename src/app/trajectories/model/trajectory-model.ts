import { LocatedTimeValueEntry } from './../../toolbox/model/api/data';
import { Dataset } from './../../toolbox/model/api/dataset/dataset';

export interface TrajectoryModel {
    trajectory?: Dataset;
    data?: Array<LocatedTimeValueEntry>;
    geometry?: GeoJSON.LineString;
}
