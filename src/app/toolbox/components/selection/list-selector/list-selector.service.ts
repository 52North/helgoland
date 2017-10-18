import { Injectable } from '@angular/core';
import { FilteredProvider } from 'helgoland-toolbox';

import { ListSelectorParameter } from './list-selector.component';

@Injectable()
export class ListSelectorService {
    public cache: Map<string, Array<ListSelectorParameter>> = new Map<string, Array<ListSelectorParameter>>();
    public providerList: Array<FilteredProvider>;
}
