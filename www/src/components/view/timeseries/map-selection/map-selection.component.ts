import { Component, OnInit } from '@angular/core';
import { TimeseriesProviderSelectionService } from '../provider-selection/provider-selection.service';
import { TimeseriesService } from '../services/timeseries.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlatformTypes, ValueTypes, Phenomenon, Dataset } from '../../../../model';

@Component({
    selector: 'n52-timeseries-map-selection',
    templateUrl: './map-selection.component.html'
})
export class TimeseriesMapSelectionComponent implements OnInit {

    public providerUrl;
    public stationFilter;
    public phenomenonFilter;
    public selectedPhenomenonId;
    public cluster = true;
    public platform;
    public datasetSelections: Array<Dataset> = [];

    private defaultPlatformTypes = PlatformTypes[PlatformTypes.stationary];
    private defaultValueTypes = ValueTypes[ValueTypes.quantity];
    private provider = this.providerCache.getSelectedProvider();

    constructor(
        private providerCache: TimeseriesProviderSelectionService,
        private timeseriesService: TimeseriesService,
        private modalService: NgbModal
    ) { }

    public ngOnInit() {
        this.providerUrl = this.provider.providerUrl;
        this.updateStationFilter();
        this.updatePhenomenonFilter();
    }

    public onStationSelected(platform, content) {
        this.platform = platform;
        this.modalService.open(content);
    }

    public onPhenomenonSelected(phenomenon: Phenomenon) {
        this.selectedPhenomenonId = phenomenon.id;
        this.updateStationFilter(phenomenon.id);
    }

    public onAllPhenomenonSelected() {
        this.selectedPhenomenonId = null;
        this.updateStationFilter();
    }

    public onDatasetSelectionChanged(datasets: Array<Dataset>) {
        this.datasetSelections = datasets;
    }

    public openDatasets() {
        if (this.datasetSelections.length > 0) {
            this.datasetSelections.forEach((entry) => {
                this.timeseriesService.addTimeseries(entry, entry.url);
            });
        }
    }

    private updateStationFilter(phenomenonId?: string) {
        this.stationFilter = {
            platformTypes: this.defaultPlatformTypes,
            valueTypes: this.defaultValueTypes,
            service: this.provider.id
        };
        if (phenomenonId) this.stationFilter.phenomenon = phenomenonId;
    }

    private updatePhenomenonFilter() {
        this.phenomenonFilter = {
            platformTypes: this.defaultPlatformTypes,
            valueTypes: this.defaultValueTypes,
            service: this.provider.id
        };
    }

}
