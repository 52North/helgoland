/* tslint:disable:max-line-length */
import {
    MultiServiceFilterSelectorComponent,
    ServiceFilterSelectorComponent,
    ProviderSelectorComponent,
    StationMapSelectorComponent
} from './src/components/selection';

import {
    LabelMapperComponent,
    GeometryMapViewerComponent
} from './src/components/display';

import { mainApp } from './app';
import { downgradeComponent } from '@angular/upgrade/static';

mainApp
    .directive('n52MultiServiceFilterSelector', downgradeComponent({ component: MultiServiceFilterSelectorComponent }) as angular.IDirectiveFactory)
    .directive('n52ServiceFilterSelector', downgradeComponent({ component: ServiceFilterSelectorComponent }) as angular.IDirectiveFactory)
    .directive('n52ProviderSelector', downgradeComponent({ component: ProviderSelectorComponent }) as angular.IDirectiveFactory)
    .directive('n52LabelMapper', downgradeComponent({ component: LabelMapperComponent }) as angular.IDirectiveFactory)
    .directive('n52StationMapSelector', downgradeComponent({ component: StationMapSelectorComponent }) as angular.IDirectiveFactory)
    .directive('n52GeometryMapViewer', downgradeComponent({ component: GeometryMapViewerComponent }) as angular.IDirectiveFactory);
