import { Component } from '@angular/core';
import { HelgolandParameterFilter, HelgolandServicesConnector } from '@helgoland/core';
import { FilteredParameter, MultiServiceFilterSelectorComponent } from '@helgoland/selector';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'n52-custom-multi-service-filter-selector',
  templateUrl: './custom-multi-service-filter-selector.component.html',
  styleUrls: ['./custom-multi-service-filter-selector.component.scss']
})
export class CustomMultiServiceFilterSelectorComponent extends MultiServiceFilterSelectorComponent {

  constructor(
    protected servicesConnector: HelgolandServicesConnector,
    protected translate: TranslateService
  ) {
    super(servicesConnector, translate);
  }


  protected setItems(
    res: FilteredParameter[],
    prevfilter: HelgolandParameterFilter,
    url: string,
    service?: string,
  ): void {

    // try to identify depth-labels and sort them as numbers
    if (/^-?[\d.]+m$/.test(res[0].label)) {
      // sort numerically
      res = res.sort((a, b) => parseFloat(b.label) - parseFloat(a.label));
    } else {
      // sort alphabetically by default
      res = res.sort();
    }
    super.setItems(res, prevfilter, url, service);
  }
}
