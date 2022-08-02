import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HelgolandD3Module } from '@helgoland/d3';
import {
    HelgolandDatasetDownloadModule,
    HelgolandDatasetlistModule,
    HelgolandDatasetTableModule,
    HelgolandLabelMapperModule,
} from '@helgoland/depiction';
import { HelgolandFavoriteModule } from '@helgoland/favorite';
import { HelgolandMapControlModule, HelgolandMapSelectorModule } from '@helgoland/map';
import { HelgolandModificationModule } from '@helgoland/modification';
import { HelgolandSelectorModule } from '@helgoland/selector';
import { HelgolandTimeModule } from '@helgoland/time';
import {
    NgbAccordionModule,
    NgbButtonsModule,
    NgbCollapseModule,
    NgbDropdownModule,
    NgbModalModule,
    NgbTabsetModule,
    NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { CustomTimeseriesRouter } from '../../apps/timeseries/app/router.service';
import { ComponentsModule } from '../components/components.module';
import { CategorySelectorComponent } from './category-selection/category-selector.component';
import { CustomHoverLineComponent } from './diagram/custom-hover-line/custom-hover-line.component';
import { TimeseriesDiagramPermalink } from './diagram/diagram-permalink.service';
import { TimeseriesDiagramComponent } from './diagram/diagram.component';
import { CustomDatasetPermalinkDownloadComponent } from './diagram/legend-entry/custom-dataset-permalink-download.component';
import { LegendEntryComponent } from './diagram/legend-entry/legend-entry.component';
import { TimeseriesFavoritesComponent } from './favorites/favorites.component';
import { TimeseriesListSelectionComponent } from './list-selection/list-selection.component';
import { TimeseriesMapSelectionComponent } from './map-selection/map-selection.component';
import { TimeseriesNavigationComponent } from './navigation/navigation.component';
import { CustomServiceProviderCache } from './services/custom-service-provider-cache.service';
import { TimeseriesListSelectionCache } from './services/list-selection-cache.service';
import { TimeseriesMapSelectionCache } from './services/map-selection-cache.service';
import { TimeseriesRouter } from './services/timeseries-router.service';
import { TimeseriesService } from './services/timeseries.service';
import { TimeseriesTableComponent } from './table/table.component';


export const timeseriesRoutes: Routes = [
    {
        path: 'diagram',
        component: TimeseriesDiagramComponent
    },
    {
        path: 'table',
        component: TimeseriesTableComponent
    },
    {
        path: 'map-selection',
        component: TimeseriesMapSelectionComponent
    },
    {
        path: 'list-selection',
        component: TimeseriesListSelectionComponent
    },
    {
        path: 'favorites',
        component: TimeseriesFavoritesComponent
    }
];

export const nestedTimeseriesRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'timeseries'
    },
    {
        path: 'timeseries',
        component: TimeseriesNavigationComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'diagram'
            },
            ...timeseriesRoutes
        ]
    }
];

@NgModule({
    imports: [
        CommonModule,
        ComponentsModule,
        FormsModule,
        HelgolandD3Module,
        HelgolandDatasetDownloadModule,
        HelgolandDatasetTableModule,
        HelgolandDatasetlistModule,
        HelgolandFavoriteModule,
        HelgolandLabelMapperModule,
        HelgolandMapControlModule,
        HelgolandMapSelectorModule,
        HelgolandModificationModule,
        HelgolandSelectorModule,
        HelgolandTimeModule,
        NgbAccordionModule,
        NgbButtonsModule,
        NgbCollapseModule,
        NgbDropdownModule,
        NgbModalModule,
        NgbTabsetModule,
        NgbTooltipModule,
        RouterModule,
        TranslateModule,
    ],
    declarations: [
        CategorySelectorComponent,
        CustomDatasetPermalinkDownloadComponent,
        CustomHoverLineComponent,
        LegendEntryComponent,
        TimeseriesDiagramComponent,
        TimeseriesFavoritesComponent,
        TimeseriesListSelectionComponent,
        TimeseriesMapSelectionComponent,
        TimeseriesNavigationComponent,
        TimeseriesTableComponent,
    ],
    providers: [
        CustomServiceProviderCache,
        TimeseriesDiagramPermalink,
        TimeseriesListSelectionCache,
        TimeseriesMapSelectionCache,
        TimeseriesService,
        {
            provide: TimeseriesRouter,
            useClass: CustomTimeseriesRouter
        }
    ]
})
export class TimeseriesModule { }
