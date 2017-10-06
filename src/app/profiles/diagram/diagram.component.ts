import { Component, OnInit } from '@angular/core';

import { TimedDatasetOptions } from './../../toolbox/model/api/dataset/options';
import { ProfilesService } from './../services/profiles.service';
import { ProfilesDiagramPermalink } from './diagram-permalink.service';

@Component({
    selector: 'n52-diagram',
    templateUrl: './diagram.component.html',
    styleUrls: ['./diagram.component.scss']
})
export class ProfilesDiagramComponent implements OnInit {

    public datasetIds: Array<string>;

    protected selectedIds: Array<string> = [];

    public datasetOptions: Map<string, Array<TimedDatasetOptions>>;

    constructor(
        private profilesSrvc: ProfilesService,
        private permalinkSrvc: ProfilesDiagramPermalink
    ) {
        this.permalinkSrvc.validatePeramlink();
        this.datasetIds = profilesSrvc.datasetIds;
        this.datasetOptions = profilesSrvc.datasetOptions;
    }

    ngOnInit() { }

    public isSelected(internalId: string) {
        return this.selectedIds.find(e => e === internalId);
    }

    public deleteProfile(internalId: string) {
        this.profilesSrvc.removeDataset(internalId);
    }

    public selectProfile(selected: boolean, internalId: string) {
        if (selected) {
            this.selectedIds.push(internalId);
        } else {
            this.selectedIds.splice(this.selectedIds.findIndex(e => e === internalId), 1);
        }
    }

    public deleteProfileOptions(options: TimedDatasetOptions) {
        this.profilesSrvc.removeDatasetOptions(options);
    }

    public updateOptions(options: Array<TimedDatasetOptions>, internalId: string) {
        this.profilesSrvc.updateDatasetOptions(options, internalId);
    }

}
