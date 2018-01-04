import { ListSelectorService } from 'helgoland-toolbox/dist/components/selector/list-selector/list-selector.service';
import { ListSelectorComponent } from 'helgoland-toolbox/dist/components/selector/list-selector/list-selector.component';
import { Component, OnInit } from '@angular/core';
import { ApiInterface, ApiMapping } from 'helgoland-toolbox';

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
