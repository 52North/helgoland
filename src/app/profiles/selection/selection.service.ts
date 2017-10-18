import { Injectable } from '@angular/core';
import { Feature, Offering, Phenomenon, Procedure, Service } from 'helgoland-toolbox';

@Injectable()
export class ProfilesSelectionCache {
    public selectedProvider: Service;
    public selectedOffering: Offering;
    public selectedPhenomenon: Phenomenon;
    public selectedProcedure: Procedure;
    public selectedFeature: Feature;
}
