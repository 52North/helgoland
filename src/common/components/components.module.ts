import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HelgolandCoreModule } from '@helgoland/core';
import { HelgolandLabelMapperModule } from '@helgoland/depiction';
import { HelgolandMapViewModule } from '@helgoland/map';
import { HelgolandModificationModule } from '@helgoland/modification';
import { HelgolandPermalinkModule } from '@helgoland/permalink';
import { HelgolandSelectorModule } from '@helgoland/selector';
import { HelgolandTimeModule } from '@helgoland/time';
import {
  NgbAccordionModule,
  NgbAlertModule,
  NgbDatepickerModule,
  NgbDropdownModule,
  NgbTimepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ClipboardModule } from 'ngx-clipboard';

import { CustomAutoUpdateTimespanComponent } from './custom-auto-update-timespan/custom-auto-update-timespan.component';
import { CustomListSelectorComponent } from './custom-list-selector/custom-list-selector.component';
import {
  CustomMinMaxRangeComponent,
} from './custom-min-max-range/custom-min-max-range.component';
import {
  CustomMultiServiceFilterSelectorComponent,
} from './custom-multi-service-filter-selector/custom-multi-service-filter-selector.component';
import {
  CustomServiceProviderManagerComponent,
} from './custom-service-provider-manager/custom-service-provider-manager.component';
import { CustomServiceSelectorComponent } from './custom-service-selector/custom-service-selector.component';
import { CustomTimeRangeSliderComponent } from './custom-time-range-slider/custom-time-range-slider.component';
import { CustomTimespanButtonComponent } from './custom-timespan-button/custom-timespan-button.component';
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
import { ProviderParameterSeletorComponent } from './provider-parameter-selector/provider-parameter-selector.component';
import { TimespanSelectorComponent } from './timespan-selector/timespan-selector.component';

@NgModule({
  imports: [
    ClipboardModule,
    CommonModule,
    FormsModule,
    HelgolandCoreModule,
    HelgolandLabelMapperModule,
    HelgolandMapViewModule,
    HelgolandModificationModule,
    HelgolandPermalinkModule,
    HelgolandSelectorModule,
    HelgolandTimeModule,
    NgbAccordionModule,
    NgbAlertModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    NgbTimepickerModule,
    TranslateModule.forChild()
  ],
  declarations: [
    CustomListSelectorComponent,
    CustomMinMaxRangeComponent,
    CustomAutoUpdateTimespanComponent,
    CustomMultiServiceFilterSelectorComponent,
    CustomServiceSelectorComponent,
    CustomTimeRangeSliderComponent,
    CustomTimespanShiftSelectorComponent,
    CustomServiceProviderManagerComponent,
    CustomTimespanButtonComponent,
    InMailComponent,
    InNewWindowComponent,
    LocalSelectorImplComponent,
    LocateButtonComponent,
    ModalGeometryViewerComponent,
    ModalOptionsEditorComponent,
    ModalTimeseriesTimespanComponent,
    PermalinkButtonComponent,
    ProviderParameterSeletorComponent,
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
    CustomServiceProviderManagerComponent,
    CustomAutoUpdateTimespanComponent,
    CustomTimeRangeSliderComponent,
    CustomTimespanShiftSelectorComponent,
    LocalSelectorImplComponent,
    LocateButtonComponent,
    PermalinkButtonComponent,
    CustomTimespanButtonComponent,
    ProviderParameterSeletorComponent,
  ]
})
export class ComponentsModule { }
