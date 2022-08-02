import { Component } from '@angular/core';
import { DatasetPermalinkDownloadComponent } from '@helgoland/depiction';

@Component({
    selector: 'n52-custom-dataset-permalink-download',
    templateUrl: './custom-dataset-permalink-download.component.html',
    styleUrls: ['./custom-dataset-permalink-download.component.scss']
})
export class CustomDatasetPermalinkDownloadComponent extends DatasetPermalinkDownloadComponent { 

    triggerDownload() {
        window.open(this.downloadLink);
    }
}
