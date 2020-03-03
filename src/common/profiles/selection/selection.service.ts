import { Injectable } from '@angular/core';
import { Feature, Offering, Phenomenon, Procedure, Service, HelgolandService } from '@helgoland/core';

@Injectable()
export class ProfilesSelectionCache {
    public selectedProvider: HelgolandService;
    public selectedOffering: Offering;
    public selectedPhenomenon: Phenomenon;
    public selectedProcedure: Procedure;
    public selectedFeature: Feature;
}
