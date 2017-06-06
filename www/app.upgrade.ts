import { MultiServiceFilterSelectorComponent } from './src/components/selection/multi-service-filter-selector.component';

import { mainApp } from './app';
import { downgradeComponent } from '@angular/upgrade/static';

mainApp
    .directive('multiServiceFilterSelector', downgradeComponent({ component: MultiServiceFilterSelectorComponent }) as angular.IDirectiveFactory);
