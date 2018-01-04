import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbAccordionModule, NgbDatepickerModule, NgbDropdownModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  HelgolandMapViewModule,
  HelgolandModificationModule,
  HelgolandPermalinkModule,
  HelgolandSelectorModule,
  HelgolandTimeModule,
} from 'helgoland-toolbox';

import { CustomListSelectorComponent } from './custom-list-selector/custom-list-selector.component';
import { LocalSelectorImplComponent } from './local-selector/local-selector.component';
import { ModalGeometryViewerComponent } from './modal-geometry-viewer/modal-geometry-viewer.component';
import { ModalOptionsEditorComponent } from './modal-options-editor/modal-options-editor.component';
import { ModalTimeseriesTimespanComponent } from './modal-timeseries-timespan/modal-timeseries-timespan.component';
import { PermalinkButtonComponent } from './permalink-button/permalink-button.component';
import { TimespanSelectorComponent } from './timespan-selector/timespan-selector.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    NgbAccordionModule,
    HelgolandMapViewModule,
    HelgolandTimeModule,
    HelgolandPermalinkModule,
    HelgolandSelectorModule,
    TranslateModule.forChild(),
    HelgolandModificationModule
  ],
  declarations: [
    LocalSelectorImplComponent,
    ModalOptionsEditorComponent,
    ModalGeometryViewerComponent,
    ModalTimeseriesTimespanComponent,
    PermalinkButtonComponent,
    TimespanSelectorComponent,
    CustomListSelectorComponent
  ],
  entryComponents: [
    LocalSelectorImplComponent,
    ModalOptionsEditorComponent,
    ModalGeometryViewerComponent,
    ModalTimeseriesTimespanComponent
  ],
  exports: [
    LocalSelectorImplComponent,
    PermalinkButtonComponent,
    CustomListSelectorComponent
  ]
})
export class ComponentsModule { }
