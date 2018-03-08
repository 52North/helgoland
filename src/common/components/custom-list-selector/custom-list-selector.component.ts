import { Component } from '@angular/core';
import { ApiInterface, ApiMapping } from '@helgoland/core';
import { ListSelectorComponent, ListSelectorService } from '@helgoland/selector';

@Component({
  selector: 'n52-custom-list-selector',
  templateUrl: './custom-list-selector.component.html',
  styleUrls: ['./custom-list-selector.component.scss']
})
export class CustomListSelectorComponent extends ListSelectorComponent {

  constructor(
    protected listSelectorService: ListSelectorService,
    protected apiInterface: ApiInterface,
    protected apiMapping: ApiMapping
  ) {
    super(listSelectorService, apiInterface, apiMapping);
  }

}
