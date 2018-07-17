import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HelgolandLabelMapperModule } from '@helgoland/depiction';
import { HelgolandMapViewModule } from '@helgoland/map';
import { HelgolandModificationModule } from '@helgoland/modification';
import { HelgolandPermalinkModule } from '@helgoland/permalink';
import { HelgolandSelectorModule } from '@helgoland/selector';
import { HelgolandTimeModule } from '@helgoland/time';
import { NgbAccordionModule, NgbDatepickerModule, NgbDropdownModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ClipboardModule } from 'ngx-clipboard';

import { CustomListSelectorComponent } from './custom-list-selector/custom-list-selector.component';
import {
  CustomMultiServiceFilterSelectorComponent,
} from './custom-multi-service-filter-selector/custom-multi-service-filter-selector.component';
import { CustomServiceSelectorComponent } from './custom-service-selector/custom-service-selector.component';
import {
  CustomTimespanShiftSelectorComponent,
} from './custom-timespan-shift-selector/custom-timespan-shift-selector.component';
import { LocalSelectorImplComponent } from './local-selector/local-selector.component';
import { LocateButtonComponent } from './locate-button/locate-button.component';
import { ModalGeometryViewerComponent } from './modal-geometry-viewer/modal-geometry-viewer.component';
import { ModalOptionsEditorComponent } from './modal-options-editor/modal-options-editor.component';
import { ModalTimeseriesTimespanComponent } from './modal-timeseries-timespan/modal-timeseries-timespan.component';
import { InMailComponent } from './permalink/in-mail/in-mail.component';
import { InNewWindowComponent } from './permalink/in-new-window/in-new-window.component';
import { PermalinkButtonComponent } from './permalink/permalink-button/permalink-button.component';
import { ToClipboardComponent } from './permalink/to-clipboard/to-clipboard.component';
import { TimespanSelectorComponent } from './timespan-selector/timespan-selector.component';
import { CustomMinMaxRangeComponent } from './custom-min-max-range/custom-min-max-range.component';

@NgModule({
  imports: [
    ClipboardModule,
    CommonModule,
    FormsModule,
    HelgolandLabelMapperModule,
    HelgolandMapViewModule,
    HelgolandModificationModule,
    HelgolandPermalinkModule,
    HelgolandSelectorModule,
    HelgolandTimeModule,
    NgbAccordionModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    NgbTimepickerModule,
    TranslateModule.forChild()
  ],
  declarations: [
    CustomListSelectorComponent,
    CustomMinMaxRangeComponent,
    CustomMultiServiceFilterSelectorComponent,
    CustomServiceSelectorComponent,
    CustomTimespanShiftSelectorComponent,
    InMailComponent,
    InNewWindowComponent,
    LocalSelectorImplComponent,
    LocateButtonComponent,
    ModalGeometryViewerComponent,
    ModalOptionsEditorComponent,
    ModalTimeseriesTimespanComponent,
    PermalinkButtonComponent,
    TimespanSelectorComponent,
    ToClipboardComponent,
  ],
  entryComponents: [
    LocalSelectorImplComponent,
    ModalGeometryViewerComponent,
    ModalOptionsEditorComponent,
    ModalTimeseriesTimespanComponent
  ],
  exports: [
    CustomListSelectorComponent,
    CustomServiceSelectorComponent,
    CustomTimespanShiftSelectorComponent,
    LocalSelectorImplComponent,
    LocateButtonComponent,
    PermalinkButtonComponent,
  ]
})
export class ComponentsModule { }
