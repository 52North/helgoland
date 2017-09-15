import { Injectable } from '@angular/core';

import { Phenomenon } from '../../toolbox/model/api/phenomenon';
import { Feature } from './../../toolbox/model/api/feature';
import { Offering } from './../../toolbox/model/api/offering';
import { Procedure } from './../../toolbox/model/api/procedure';
import { Service } from './../../toolbox/model/api/service';

@Injectable()
export class ProfilesSelectionCache {
    public selectedProvider: Service;
    public selectedOffering: Offering;
    public selectedPhenomenon: Phenomenon;
    public selectedProcedure: Procedure;
    public selectedFeature: Feature;
}
