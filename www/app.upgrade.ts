/* tslint:disable:max-line-length */
import {
    MultiServiceFilterSelectorComponent
} from './src/components/selection/multi-service-filter-selector/multi-service-filter-selector.component';

import { mainApp } from './app';
import { downgradeComponent } from '@angular/upgrade/static';

mainApp
    .directive('n52MultiServiceFilterSelector', downgradeComponent({
        component: MultiServiceFilterSelectorComponent,
        inputs: ['endpoint', 'filterList'],
        outputs: ['itemSelected']
    }) as angular.IDirectiveFactory);
