/* tslint:disable:max-line-length */
import {
    MultiServiceFilterSelectorComponent,
    ServiceFilterSelectorComponent,
    ProviderSelectorComponent
} from './src/components/selection';

import {
    LabelMapperComponent
} from './src/components/display';

import { mainApp } from './app';
import { downgradeComponent } from '@angular/upgrade/static';

mainApp
    .directive('n52MultiServiceFilterSelector', downgradeComponent({
        component: MultiServiceFilterSelectorComponent,
        inputs: ['endpoint', 'filterList'],
        outputs: ['itemSelected']
    }) as angular.IDirectiveFactory)
    .directive('n52ServiceFilterSelector', downgradeComponent({
        component: ServiceFilterSelectorComponent,
        inputs: ['endpoint', 'serviceUrl', 'filter', 'selectionId'],
        outputs: ['itemSelected']
    }) as angular.IDirectiveFactory)
    .directive('n52ProviderSelector', downgradeComponent({
        component: ProviderSelectorComponent,
        inputs: ['providerList', 'providerBlacklist', 'supportStations', 'selectedProvider', 'filter'],
        outputs: ['providerSelected']
    }) as angular.IDirectiveFactory)
    .directive('n52LabelMapper', downgradeComponent({
        component: LabelMapperComponent,
        inputs: ['label']
    }));
