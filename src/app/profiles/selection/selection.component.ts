import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap/tabset/tabset.module';

import { IDataset } from '../../toolbox/model/api/dataset/idataset';
import { PlatformTypes } from '../../toolbox/model/api/dataset/platformTypes';
import { ValueTypes } from '../../toolbox/model/api/dataset/valueTypes';
import { TrajectoryResult } from './../../toolbox/components/selection/map-selector/trajectory-map-selector.component';
import { ProfileDataEntry } from './../../toolbox/model/api/data';
import { TimedDatasetOptions } from './../../toolbox/model/api/dataset/options';
import { Feature } from './../../toolbox/model/api/feature';
import { Offering } from './../../toolbox/model/api/offering';
import { ParameterFilter } from './../../toolbox/model/api/parameterFilter';
import { Phenomenon } from './../../toolbox/model/api/phenomenon';
import { Platform } from './../../toolbox/model/api/platform';
import { Procedure } from './../../toolbox/model/api/procedure';
import { Service } from './../../toolbox/model/api/service';
import { BlacklistedService } from './../../toolbox/model/config/config';
import { Timespan } from './../../toolbox/model/internal/time-interval';
import { ApiInterface } from './../../toolbox/services/api-interface/api-interface.service';
import { Settings } from './../../toolbox/services/settings/settings.service';
import { ProfilesService } from './../services/profiles.service';
import { ProfilesSelectionPermalink } from './selection-permalink.service';
import { ProfilesSelectionCache } from './selection.service';

@Component({
    selector: 'n52-profiles-selection',
    templateUrl: './selection.component.html',
    styleUrls: ['./selection.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProfilesSelectionComponent implements OnInit {

    public providerList: Array<string>;
    public providerBlacklist: Array<BlacklistedService>;

    public providerFilter: ParameterFilter;
    public offeringFilter: ParameterFilter;
    public phenomenonFilter: ParameterFilter;
    public procedureFilter: ParameterFilter;
    public stationaryPlatformFilter: ParameterFilter;
    public mobilePlatformFilter: ParameterFilter;
    public trajectoryFilter: ParameterFilter;

    public selectedProvider: Service;
    public selectedOffering: Offering;
    public selectedPhenomenon: Phenomenon;
    public selectedProcedure: Procedure;
    public selectedFeature: Feature;

    public stationaryPlatform: Platform;
    public stationaryPlatformLoading: boolean;
    public stationaryPlatformDataset: IDataset;
    public stationaryTimestamps: Array<number>;

    public mobileTimestamps: Array<number>;
    public selectedMobileTimespan: Timespan;

    public mobilePreviewDataset: IDataset;
    public mobilePreviewTimestamp: number;
    public mobilePreviewOptions: Map<string, Array<TimedDatasetOptions>>;

    @ViewChild('modalStationaryPlatform')
    public modalStationaryPlatform: TemplateRef<any>;

    @ViewChild('modalMobilePreview')
    public modalMobilePreview: TemplateRef<any>;

    @ViewChild('profileSelection')
    public tabset: NgbTabset;

    constructor(
        private settings: Settings,
        private cache: ProfilesSelectionCache,
        private selectionPermalink: ProfilesSelectionPermalink,
        private modalService: NgbModal,
        private api: ApiInterface,
        private router: Router,
        private profilesSrvc: ProfilesService
    ) { }

    ngOnInit() {
        this.selectionPermalink.validatePeramlink().subscribe((selection) => {
            if (selection.selectedProvider) { this.providerSelected(selection.selectedProvider, false); }
            if (selection.selectedOffering) { this.offeringSelected(selection.selectedOffering, false); }
            if (selection.selectedPhenomenon) { this.phenomenonSelected(selection.selectedPhenomenon, false); }
            if (selection.selectedProcedure) { this.procedureSelected(selection.selectedProcedure, false); }
            if (selection.selectedFeature) { this.featureSelected(selection.selectedFeature); }
        });
        this.providerList = this.settings.config.restApiUrls;
        this.providerBlacklist = this.settings.config.providerBlackList;
        this.providerFilter = this.createFilter();
    }

    private createFilter(): ParameterFilter {
        const filter: ParameterFilter = {
            valueTypes: ValueTypes.quantityProfile
        };
        if (this.selectedProvider) { filter.service = this.selectedProvider.id; }
        if (this.selectedOffering) { filter.offering = this.selectedOffering.id; }
        if (this.selectedPhenomenon) { filter.phenomenon = this.selectedPhenomenon.id; }
        if (this.selectedProcedure) {
            filter.procedure = this.selectedProcedure.id;
            filter.expanded = true;
        }
        if (this.selectedFeature) { filter.feature = this.selectedFeature.id; }
        return filter;
    }

    private setSelectedProvider(provider: Service) {
        this.selectedProvider = this.cache.selectedProvider = provider;
    }

    private setSelectedOffering(offering: Offering) {
        this.selectedOffering = this.cache.selectedOffering = offering;
    }

    private setSelectedPhenomenon(phenomenon: Phenomenon) {
        this.selectedPhenomenon = this.cache.selectedPhenomenon = phenomenon;
    }

    private setSelectedProcedure(procedure: Procedure) {
        this.selectedProcedure = this.cache.selectedProcedure = procedure;
    }

    private setSelectedFeature(feature: Feature) {
        this.selectedFeature = this.cache.selectedFeature = feature;
    }

    private providerSelected(provider: Service, clearPrevious: boolean) {
        this.openTabById('selectOffering');
        if (clearPrevious) {
            this.setSelectedOffering(null);
            this.setSelectedPhenomenon(null);
            this.setSelectedProcedure(null);
            this.setSelectedFeature(null);
        }
        this.setSelectedProvider(provider);
        this.offeringFilter = this.createFilter();
    }

    private offeringSelected(offering: Offering, clearPrevious: boolean) {
        this.openTabById('selectPhenomenon');
        if (clearPrevious) {
            this.setSelectedPhenomenon(null);
            this.setSelectedProcedure(null);
            this.setSelectedFeature(null);
        }
        this.setSelectedOffering(offering);
        this.phenomenonFilter = this.createFilter();
    }

    private phenomenonSelected(phenomenon: Phenomenon, clearPrevious: boolean) {
        this.openTabById('selectProcedure');
        if (clearPrevious) {
            this.setSelectedProcedure(null);
            this.setSelectedFeature(null);
        }
        this.setSelectedPhenomenon(phenomenon);
        this.procedureFilter = this.createFilter();
    }

    private procedureSelected(procedure: Procedure, clearPrevious: boolean) {
        this.openTabById('selectPlatform');
        if (clearPrevious) {
            this.setSelectedFeature(null);
        }
        this.setSelectedProcedure(procedure);
        this.stationaryPlatformFilter = this.createFilter();
        this.mobilePlatformFilter = this.createFilter();
        this.stationaryPlatformFilter.platformTypes = PlatformTypes.stationary;
        this.mobilePlatformFilter.platformTypes = PlatformTypes.mobile;
    }

    private featureSelected(feature: Feature) {
        this.openTabById('selectProfile');
        this.setSelectedFeature(feature);
        this.trajectoryFilter = this.createFilter();
    }

    private openTabById(id: string) {
        this.tabset.tabs.find(entry => entry.id === id).disabled = false;
        this.tabset.select(id);
    }

    public onStationaryPlatformSelected(platform: Platform) {
        this.modalService.open(this.modalStationaryPlatform);
        this.stationaryPlatform = platform;
        this.stationaryPlatformLoading = true;
        platform.datasets.forEach(dataset => {
            this.stationaryPlatformDataset = dataset;
            this.api.getDataset(dataset.id, this.selectedProvider.providerUrl).subscribe(res => {
                this.stationaryPlatformDataset = res;
                const timespan = new Timespan(new Date(res.firstValue.timestamp), new Date(res.lastValue.timestamp));
                this.api.getData<ProfileDataEntry>(res.id, res.url, timespan).subscribe(data => {
                    this.stationaryTimestamps = [];
                    data.values.forEach(entry => {
                        this.stationaryTimestamps.push(entry.timestamp);
                    });
                    this.stationaryPlatformLoading = false;
                });
            });
        });
    }

    public onTimeselected(timestamp: number) {
        this.addProfileToChart(this.stationaryPlatformDataset, timestamp);
    }

    public onMobileSelected(selection: TrajectoryResult) {
        this.mobilePreviewDataset = selection.dataset;
        this.mobilePreviewTimestamp = selection.data.timestamp;
        this.mobilePreviewOptions = new Map();
        const options = new TimedDatasetOptions(selection.dataset.internalId, selection.data.timestamp);
        this.mobilePreviewOptions.set(selection.dataset.internalId, [options]);
        this.modalService.open(this.modalMobilePreview, { size: 'lg' });
    }

    public addToChart() {
        this.addProfileToChart(this.mobilePreviewDataset, this.mobilePreviewTimestamp);
    }

    private addProfileToChart(dataset: IDataset, timestamp: number) {
        const options = new TimedDatasetOptions(dataset.internalId, timestamp);
        this.profilesSrvc.addDataset(dataset.internalId, [options]);
        this.router.navigate(['profiles/diagram']);
    }

    public timelistDetermined(timelist: Array<number>) {
        this.mobileTimestamps = timelist;
    }

    public onTimespanSelected(timespan: Timespan) {
        this.selectedMobileTimespan = timespan;
    }

}
