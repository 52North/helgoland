import { Component } from '@angular/core';
import { DatasetApiInterface } from '@helgoland/core';
import { MultiServiceFilterSelectorComponent } from '@helgoland/selector';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'n52-custom-multi-service-filter-selector',
  templateUrl: './custom-multi-service-filter-selector.component.html',
  styleUrls: ['./custom-multi-service-filter-selector.component.scss']
})
export class CustomMultiServiceFilterSelectorComponent extends MultiServiceFilterSelectorComponent {

  constructor(
    protected apiInterface: DatasetApiInterface,
    protected translate: TranslateService
  ) {
    super(apiInterface, translate);
  }

}
