import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';

import { IDataset } from './../../model/api/dataset/idataset';

const INTERNAL_ID_SEPERATOR = '__';

export interface InternalDatasetId {
    id: string;
    url: string;
}

@Injectable()
export class InternalIdHandler {

    constructor() { }

    public generateInternalId(dataset: IDataset) {
        dataset.internalId = dataset.url + INTERNAL_ID_SEPERATOR + dataset.id;
    }

    public resolveInternalId(internalId: string): InternalDatasetId {
        const split = internalId.split(INTERNAL_ID_SEPERATOR);
        if (split.length !== 2) {
            console.error('InternalID ' + internalId + ' is not resolvable');
        } else {
            return {
                url: split[0],
                id: split[1]
            };
        }
    }
}
