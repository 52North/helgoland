import { Component } from '@angular/core';
import { ServiceSelectorComponent, ServiceSelectorService } from '@helgoland/selector';

@Component({
  selector: 'n52-custom-service-selector',
  templateUrl: './custom-service-selector.component.html',
  styleUrls: ['./custom-service-selector.component.scss']
})
export class CustomServiceSelectorComponent extends ServiceSelectorComponent {

  constructor(
    protected providerSelectorService: ServiceSelectorService
  ) {
    super(providerSelectorService);
  }

}
