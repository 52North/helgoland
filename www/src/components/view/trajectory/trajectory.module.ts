import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SelectionModule } from '../../selection/selection-module';
import { TrajectorySelectionComponent } from './selection/selection.component';

// import { ControlModule } from '../../../components/control';
// import { DisplayModule } from '../../../components/display';

@NgModule({
    imports: [
        CommonModule,
        SelectionModule,
        // DisplayModule,
        // ControlModule,
        NgbModule
    ],
    declarations: [
        TrajectorySelectionComponent
    ],
    entryComponents: [
        TrajectorySelectionComponent
    ],
    providers: [
    ]
})
export class TrajectoryModule { }
