import { downgradeComponent } from '@angular/upgrade/static';
import * as angular from 'angular';

import { mainApp } from './app';
import {
    BoolTogglerComponent,
    LocateControlComponent,
    StringTogglerComponent,
    ZoomControlComponent,
} from './src/components/control';
import {
    DThreeDiagramComponent,
    FlotDiagramComponent,
    FlotOverviewDiagramComponent,
    GeometryMapViewerComponent,
    LabelMapperComponent,
    LegendEntryComponent,
} from './src/components/display';
import {
    DatasetByStationSelectorComponent,
    ListSelectorComponent,
    MultiServiceFilterSelectorComponent,
    ProviderSelectorComponent,
    ServiceFilterSelectorComponent,
    StationMapSelectorComponent,
    TimespanShiftSelectorComponent,
} from './src/components/selection';
import {
    TimeseriesDiagramComponent,
    TimeseriesListSelectionComponent,
    TimeseriesMapSelectionComponent,
    TimeseriesProviderSelectionComponent,
} from './src/components/view/timeseries';
import { TrajectorySelectionComponent, TrajectoryViewComponent } from './src/components/view/trajectory';

/* tslint:disable:max-line-length */
mainApp
    .directive('n52MultiServiceFilterSelector', downgradeComponent({ component: MultiServiceFilterSelectorComponent }) as angular.IDirectiveFactory)
    .directive('n52ServiceFilterSelector', downgradeComponent({ component: ServiceFilterSelectorComponent }) as angular.IDirectiveFactory)
    .directive('n52ProviderSelector', downgradeComponent({ component: ProviderSelectorComponent }) as angular.IDirectiveFactory)
    .directive('n52StationMapSelector', downgradeComponent({ component: StationMapSelectorComponent }) as angular.IDirectiveFactory)
    .directive('n52ListSelector', downgradeComponent({ component: ListSelectorComponent }) as angular.IDirectiveFactory)
    .directive('n52DatasetByStationSelector', downgradeComponent({ component: DatasetByStationSelectorComponent }) as angular.IDirectiveFactory)
    .directive('n52TimespanShiftSelector', downgradeComponent({ component: TimespanShiftSelectorComponent }) as angular.IDirectiveFactory)
    .directive('n52LabelMapper', downgradeComponent({ component: LabelMapperComponent }) as angular.IDirectiveFactory)
    .directive('n52GeometryMapViewer', downgradeComponent({ component: GeometryMapViewerComponent }) as angular.IDirectiveFactory)
    .directive('n52LegendEntry', downgradeComponent({ component: LegendEntryComponent }) as angular.IDirectiveFactory)
    .directive('n52FlotDiagram', downgradeComponent({ component: FlotDiagramComponent }) as angular.IDirectiveFactory)
    .directive('n52FlotOverviewDiagram', downgradeComponent({ component: FlotOverviewDiagramComponent }) as angular.IDirectiveFactory)
    .directive('n52ZoomControl', downgradeComponent({ component: ZoomControlComponent }) as angular.IDirectiveFactory)
    .directive('n52LocateControl', downgradeComponent({ component: LocateControlComponent }) as angular.IDirectiveFactory)
    .directive('n52TimeseriesProviderSelection', downgradeComponent({ component: TimeseriesProviderSelectionComponent }) as angular.IDirectiveFactory)
    .directive('n52TimeseriesListSelection', downgradeComponent({ component: TimeseriesListSelectionComponent }) as angular.IDirectiveFactory)
    .directive('n52TimeseriesMapSelection', downgradeComponent({ component: TimeseriesMapSelectionComponent }) as angular.IDirectiveFactory)
    .directive('n52TimeseriesDiagram', downgradeComponent({ component: TimeseriesDiagramComponent }) as angular.IDirectiveFactory)
    .directive('n52TrajectorySelection', downgradeComponent({ component: TrajectorySelectionComponent }) as angular.IDirectiveFactory)
    .directive('n52TrajectoryView', downgradeComponent({ component: TrajectoryViewComponent }) as angular.IDirectiveFactory)
    .directive('n52DThreeDiagram', downgradeComponent({ component: DThreeDiagramComponent }) as angular.IDirectiveFactory)
    .directive('n52AxisToggler', downgradeComponent({ component: StringTogglerComponent}) as angular.IDirectiveFactory)
    .directive('bla', downgradeComponent({ component: BoolTogglerComponent}) as angular.IDirectiveFactory);

