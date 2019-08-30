import { Component } from '@angular/core';
import { TrajectoryEntryComponent } from '@helgoland/depiction';

@Component({
  selector: 'n52-custom-trajectory-entry',
  templateUrl: './custom-trajectory-entry.component.html',
  styleUrls: ['./custom-trajectory-entry.component.scss']
})
export class CustomTrajectoryEntryComponent extends TrajectoryEntryComponent { }
