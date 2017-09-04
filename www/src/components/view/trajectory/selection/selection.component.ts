import { TrajectoryService } from './../trajectory.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap/tabset/tabset.module';

import { PlatformTypes, ValueTypes, Dataset } from './../../../../model/api/dataset';
import { Settings } from './../../../../services/settings/settings.service';

@Component({
    selector: 'n52-trajectory-selection',
    templateUrl: 'selection.component.html',
    styleUrls: ['selection.component.scss']
})
export class TrajectorySelectionComponent implements OnInit {

    public platformParams = [
        {
            type: 'platform',
            header: 'Mobile Platform'
        }, {
            type: 'offering',
            header: 'Offering'
        }, {
            type: 'feature',
            header: 'Pfad'
        }, {
            type: 'phenomenon',
            header: 'Phänomen'
        }, {
            type: 'dataset',
            header: 'Dataset'
        }
    ];

    public phenomenonParams = [
        {
            type: 'phenomenon',
            header: 'Phänomen'
        }, {
            type: 'offering',
            header: 'Offering'
        }, {
            type: 'feature',
            header: 'Pfad'
        }, {
            type: 'dataset',
            header: 'Dataset'
        }
    ];

    @ViewChild('tabset')
    public tabset: NgbTabset;

    public paramFilter: any;
    public providerList: any;
    public providerBlacklist: any;
    public providerFilter: any;
    public selectedProvider: any;
    public activeTab: string;

    constructor(
        private settings: Settings,
        private trajectory: TrajectoryService
    ) { }

    public ngOnInit() {
        this.providerList = this.settings.config.restApiUrls;
        this.providerBlacklist = this.settings.config.providerBlackList;
        this.providerFilter = this.createFilter();
        this.paramFilter = this.createFilter();
    }

    public providerSelected(provider) {
        this.selectedProvider = [{
            serviceID: provider.id,
            url: provider.providerUrl
        }];
        this.paramFilter = this.createFilter();
        this.tabset.select('selectByPlatform');
    }

    public datasetSelected(dataset: Array<Dataset>, url) {
        if (dataset instanceof Array && dataset.length === 1) {
            this.trajectory.setTrajectory(dataset[0].id, url);
            // TODO jump to view
            // $state.go('trajectory.view');
        }
    }

    private createFilter() {
        return {
            valueTypes: ValueTypes[ValueTypes.quantity],
            platformTypes: PlatformTypes[PlatformTypes.mobile]
        };
    }

}
