/* tslint:disable:max-line-length */
import {
    MultiServiceFilterSelectorComponent,
    ServiceFilterSelectorComponent,
    ProviderSelectorComponent,
    StationMapSelectorComponent,
    ListSelectorComponent,
    DatasetByStationSelectorComponent
} from './src/components/selection';

import {
    LabelMapperComponent,
    GeometryMapViewerComponent
} from './src/components/display';

import {
    ZoomControlComponent,
    LocateControlComponent
} from './src/components/control';

import {
    TimeseriesProviderSelectionComponent,
    TimeseriesListSelectionComponent,
    TimeseriesMapSelectionComponent
} from './src/components/view/timeseries';

import { mainApp } from './app';
import { downgradeComponent } from '@angular/upgrade/static';

mainApp
    .directive('n52MultiServiceFilterSelector', downgradeComponent({ component: MultiServiceFilterSelectorComponent }) as angular.IDirectiveFactory)
    .directive('n52ServiceFilterSelector', downgradeComponent({ component: ServiceFilterSelectorComponent }) as angular.IDirectiveFactory)
    .directive('n52ProviderSelector', downgradeComponent({ component: ProviderSelectorComponent }) as angular.IDirectiveFactory)
    .directive('n52StationMapSelector', downgradeComponent({ component: StationMapSelectorComponent }) as angular.IDirectiveFactory)
    .directive('n52ListSelector', downgradeComponent({ component: ListSelectorComponent }) as angular.IDirectiveFactory)
    .directive('n52DatasetByStationSelector', downgradeComponent({ component: DatasetByStationSelectorComponent }) as angular.IDirectiveFactory)
    .directive('n52LabelMapper', downgradeComponent({ component: LabelMapperComponent }) as angular.IDirectiveFactory)
    .directive('n52GeometryMapViewer', downgradeComponent({ component: GeometryMapViewerComponent }) as angular.IDirectiveFactory)
    .directive('n52ZoomControl', downgradeComponent({ component: ZoomControlComponent }) as angular.IDirectiveFactory)
    .directive('n52LocateControl', downgradeComponent({ component: LocateControlComponent }) as angular.IDirectiveFactory)
    .directive('n52TimeseriesProviderSelection', downgradeComponent({ component: TimeseriesProviderSelectionComponent }) as angular.IDirectiveFactory)
    .directive('n52TimeseriesListSelection', downgradeComponent({ component: TimeseriesListSelectionComponent }) as angular.IDirectiveFactory)
    .directive('n52TimeseriesMapSelection', downgradeComponent({ component: TimeseriesMapSelectionComponent }) as angular.IDirectiveFactory);
