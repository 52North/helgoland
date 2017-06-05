import { TestComponent } from './src/test.component';

import { mainApp } from './app';
import { downgradeComponent } from '@angular/upgrade/static';

mainApp.directive('test', downgradeComponent({component: TestComponent}) as angular.IDirectiveFactory);
