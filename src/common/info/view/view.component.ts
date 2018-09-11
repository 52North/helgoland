import { Component, ViewEncapsulation } from '@angular/core';

import { versions } from '../../../environments/versions';

@Component({
    selector: 'n52-info-view',
    templateUrl: './view.component.html',
    styleUrls: ['./view.component.scss']
})
export class InfoViewComponent {

    public versions = versions;

}
