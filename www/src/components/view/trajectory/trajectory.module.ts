import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DisplayModule } from '../../../components/display';
import { SelectionModule } from '../../selection/selection-module';
import { TrajectorySelectionComponent } from './selection/selection.component';
import { TrajectoryService } from './trajectory.service';
import { TrajectoryViewComponent } from './view/view.component';

// import { ControlModule } from '../../../components/control';
@NgModule({
    imports: [
        CommonModule,
        SelectionModule,
        DisplayModule,
        // ControlModule,
        NgbModule
    ],
    declarations: [
        TrajectorySelectionComponent,
        TrajectoryViewComponent
    ],
    entryComponents: [
        TrajectorySelectionComponent,
        TrajectoryViewComponent
    ],
    providers: [
        TrajectoryService
    ]
})
export class TrajectoryModule { }
