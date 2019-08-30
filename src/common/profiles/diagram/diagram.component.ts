import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ProfilesCombiService } from './../combi-view/combi-view.service';
import { ProfilesService } from './../services/profiles.service';
import { ProfilesDiagramPermalink } from './diagram-permalink.service';
import { TimedDatasetOptions } from '@helgoland/core';

@Component({
    selector: 'n52-diagram',
    templateUrl: './diagram.component.html',
    styleUrls: ['./diagram.component.scss']
})
export class ProfilesDiagramComponent implements OnInit {

    @ViewChild('modalProfileOptionsEditor', {static: true})
    public modalProfileOptionsEditor: TemplateRef<any>;

    @ViewChild('modalGeometryViewer', {static: true})
    public modalGeometryViewer: TemplateRef<any>;

    public geometry: GeoJSON.GeoJsonObject;

    public datasetIds: Array<string>;

    protected selectedIds: Array<string> = [];

    public editableOptions: TimedDatasetOptions;
    public tempColor: string;

    public datasetOptions: Map<string, Array<TimedDatasetOptions>>;

    constructor(
        private modalService: NgbModal,
        private profilesSrvc: ProfilesService,
        public permalinkSrvc: ProfilesDiagramPermalink,
        private combiSrvc: ProfilesCombiService,
        private router: Router
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

    public editOption(options: TimedDatasetOptions) {
        this.modalService.open(this.modalProfileOptionsEditor);
        this.editableOptions = options;
    }

    public showGeometry(geometry: GeoJSON.GeoJsonObject) {
        this.geometry = geometry;
        this.modalService.open(this.modalGeometryViewer);
    }

    public updateOption() {
        this.editableOptions.color = this.tempColor;
        this.profilesSrvc.updateDatasetOptions(this.datasetOptions.get(this.editableOptions.internalId), this.editableOptions.internalId);
    }

    public openCombiView(option: TimedDatasetOptions) {
        this.combiSrvc.addDataset(option.internalId, [option]);
        this.router.navigate(['profiles/combi']);
    }

}
