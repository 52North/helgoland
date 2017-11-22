import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { HelgolandMapViewModule, HelgolandModificationModule } from 'helgoland-toolbox';

import { LocalSelectorImplComponent } from './local-selector/local-selector.component';
import { ModalGeometryViewerComponent } from './modal-geometry-viewer/modal-geometry-viewer.component';
import { ModalOptionsEditorComponent } from './modal-options-editor/modal-options-editor.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbDropdownModule,
    HelgolandMapViewModule,
    TranslateModule.forChild(),
    HelgolandModificationModule
  ],
  declarations: [
    LocalSelectorImplComponent,
    ModalOptionsEditorComponent,
    ModalGeometryViewerComponent
  ],
  entryComponents: [
    LocalSelectorImplComponent,
    ModalOptionsEditorComponent,
    ModalGeometryViewerComponent
  ],
  exports: [
    LocalSelectorImplComponent
  ]
})
export class ComponentsModule { }
