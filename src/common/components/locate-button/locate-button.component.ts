import { Component } from '@angular/core';
import { LocateControlComponent } from '@helgoland/map';

@Component({
  selector: 'n52-locate-button',
  templateUrl: './locate-button.component.html',
  styleUrls: ['./locate-button.component.scss']
})
export class LocateButtonComponent extends LocateControlComponent { }
