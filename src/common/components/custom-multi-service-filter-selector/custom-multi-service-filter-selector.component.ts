import { Component } from '@angular/core';
import { MultiServiceFilterSelectorComponent, ServiceSelectorService } from '@helgoland/selector';
import { ApiInterface } from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'n52-custom-multi-service-filter-selector',
  templateUrl: './custom-multi-service-filter-selector.component.html',
  styleUrls: ['./custom-multi-service-filter-selector.component.scss']
})
export class CustomMultiServiceFilterSelectorComponent extends MultiServiceFilterSelectorComponent {

  constructor(
    protected apiInterface: ApiInterface,
    protected translate: TranslateService
  ) {
    super(apiInterface, translate);
  }

}
