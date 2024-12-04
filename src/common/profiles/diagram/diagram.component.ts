import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DatasetOptions, TimedDatasetOptions } from '@helgoland/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ModalGeometryViewerComponent } from '../../components/modal-geometry-viewer/modal-geometry-viewer.component';
import { ProfilesCombiService } from './../combi-view/combi-view.service';
import { ProfilesService } from './../services/profiles.service';
import { ProfilesDiagramPermalink } from './diagram-permalink.service';
import { ModalOptionsEditorComponent } from '../../components/modal-options-editor/modal-options-editor.component';

@Component({
    selector: 'n52-diagram',
    templateUrl: './diagram.component.html',
    styleUrls: ['./diagram.component.scss']
})
export class ProfilesDiagramComponent implements OnInit {

    @ViewChild('modalGeometryViewer', { static: true })
    public modalGeometryViewer: TemplateRef<any>;

    public geometry: GeoJSON.GeoJsonObject;

    public datasetIds: Array<string>;

    protected selectedIds: Array<string> = [];

    public datasetOptions: Map<string, Array<TimedDatasetOptions>>;

    public profilesView: "diagram" | "table" = "diagram";

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
        options = JSON.parse(JSON.stringify(options));
        this.profilesSrvc.updateDatasetOptions(options, internalId);
    }

    public editOption(options: TimedDatasetOptions) {
        const ref = this.modalService.open(ModalOptionsEditorComponent);
        (ref.componentInstance as ModalOptionsEditorComponent).availableOptions = "profile";
        (ref.componentInstance as ModalOptionsEditorComponent).options = options;
        (ref.componentInstance as ModalOptionsEditorComponent).out.subscribe((updated: TimedDatasetOptions) => {
            let original = this.datasetOptions.get(options.internalId).map(orig => {
                if (orig.timestamp == updated.timestamp) {
                    return updated;
                } else {
                    return orig;
                }
            })
            this.updateOptions(original, options.internalId);
        });
    }

    public showGeometry(geometry: GeoJSON.GeoJsonObject) {
        const ref = this.modalService.open(ModalGeometryViewerComponent, { size: 'lg' });
        (ref.componentInstance as ModalGeometryViewerComponent).geometry = geometry;
    }
}
