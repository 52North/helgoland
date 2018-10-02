import { Component } from '@angular/core';
import { ServiceSelectorComponent } from '@helgoland/selector';

@Component({
  selector: 'n52-custom-service-selector',
  templateUrl: './custom-service-selector.component.html',
  styleUrls: ['./custom-service-selector.component.scss']
})
export class CustomServiceSelectorComponent extends ServiceSelectorComponent { }
