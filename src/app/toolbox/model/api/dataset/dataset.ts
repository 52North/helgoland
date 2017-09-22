import { Parameter } from './../parameter';
import { DatasetTypes } from './datasetTypes';
import { FirstLastValue } from './firstLastValue';
import { IDataset } from './idataset';
import { ParameterConstellation } from './parameterConstellation';
import { PlatformTypes } from './platformTypes';
import { Styles } from './styles';

export class DatasetParameterConstellation extends ParameterConstellation {
    platform: PlatformParameter;
}

export class Dataset extends Parameter implements IDataset {
    url: string;
    uom: string;
    internalId: string;
    firstValue: FirstLastValue;
    lastValue: FirstLastValue;
    datasetType: DatasetTypes;
    parameters: DatasetParameterConstellation;
    styles = new Styles();
    hasData = false;
    seriesParameters?: DatasetParameterConstellation;
}

export class PlatformParameter extends Parameter {
    platformType: PlatformTypes;
}
