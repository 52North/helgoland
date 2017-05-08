import angular from 'angular';
import 'angular-route';
import 'angular-ui-bootstrap';
import 'angular-ui-notification';
import 'angular-ui-notification/dist/angular-ui-notification.min.css';
import 'angular-local-storage';
import 'ui-leaflet';
import 'angular-simple-logger';
import 'angular-translate';
import 'angular-translate-loader-static-files';
import 'angular-sanitize';
import 'ng-table';
import 'ng-table/dist/ng-table.css';
import 'angular-resource';
import 'Flot/jquery.flot.js';
import 'Flot/jquery.flot.time.js';
import 'Flot/jquery.flot.crosshair.js';
import 'bootstrap-datetime-picker';
import 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap-datetime-picker';
import 'angular-ui-bootstrap/dist/ui-bootstrap-tpls.js';
import 'bootstrap-datetime-picker/css/bootstrap-datetimepicker.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'font-awesome/css/font-awesome.min.css';
import 'd3/d3';
// import 'qr-js/qr.js';

import 'n52-sensorweb-client-core/src/js/base';
import 'n52-sensorweb-client-core/src/js/Chart';
import 'n52-sensorweb-client-core/src/js/Favorite';
import 'n52-sensorweb-client-core/src/js/helper';
import 'n52-sensorweb-client-core/src/js/Legend';
import 'n52-sensorweb-client-core/src/js/ListSelection';
import 'n52-sensorweb-client-core/src/js/Loading';
import 'n52-sensorweb-client-core/src/js/Map';
import 'n52-sensorweb-client-core/src/js/Menu';
import 'n52-sensorweb-client-core/src/js/Metadata';
import 'n52-sensorweb-client-core/src/js/mobile';
import 'n52-sensorweb-client-core/src/js/Phenomenon';
import 'n52-sensorweb-client-core/src/js/Provider';
import 'n52-sensorweb-client-core/src/js/SeriesInterface';
import 'n52-sensorweb-client-core/src/js/Settings';
import 'n52-sensorweb-client-core/src/js/startup';
import 'n52-sensorweb-client-core/src/js/Styling';
import 'n52-sensorweb-client-core/src/js/Table';
import 'n52-sensorweb-client-core/src/js/Time';
import 'n52-sensorweb-client-core/src/js/plugins/extendedGetTsData.js';

import './js/navigation.js';
import './js/map.js';

import './less';

var mainApp = angular.module('jsClient', [
    'ngRoute',
    'ui.bootstrap',
    'ui-notification',
    'LocalStorageModule',
    'ui-leaflet',
    'pascalprecht.translate',
    'ngSanitize',
    'ngTable',
    'ngResource',
    'n52.core.barChart',
    'n52.core.base',
    'n52.core.dataLoading',
    'n52.core.diagram',
    'n52.core.exportTs',
    'n52.core.favoriteUi',
    'n52.core.flot',
    'n52.core.helper',
    'n52.core.interface',
    'n52.core.legend',
    'n52.core.listSelection',
    'n52.core.locate',
    'n52.core.map',
    'n52.core.menu',
    'n52.core.userSettings',
    'n52.core.legend',
    'n52.core.table',
    'n52.core.exportTs',
    'n52.core.timeUi',
    'n52.core.metadata',
    'n52.core.modal',
    'n52.core.overviewDiagram',
    'n52.core.phenomena',
    'n52.core.provider',
    'n52.core.userSettings',
    'n52.core.startup',
    'n52.core.style',
    'n52.core.table',
    'n52.core.timeUi',
    'n52.core.translate',
    'n52.client.navigation',
    'n52.client.map',
    'n52.core.mobile'
]);

mainApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'templates/views/diagramView.html',
        reloadOnSearch: false
      })
      .when('/diagram', {
        templateUrl: 'templates/views/diagramView.html',
        name: 'navigation.diagram',
        reloadOnSearch: false
      })
      .when('/map', {
        templateUrl: 'templates/views/mapView.html',
        name: 'navigation.map',
        reloadOnSearch: false
      })
      .when('/mobileDiagram', {
        templateUrl: 'templates/views/combiView.html',
        name: 'navigation.trajectories',
        reloadOnSearch: false
      })
      .when('/favorite', {
        templateUrl: 'templates/views/favoriteView.html',
        name: 'navigation.favorite',
        reloadOnSearch: false
      })
      .when('/map/provider', {
        name: 'navigation.provider',
        modal: {
          controller: 'SwcProviderListModalCtrl',
          templateUrl: 'templates/map/provider-list-modal.html'
        },
        reloadOnSearch: false
      })
      .when('/diagram/listSelection', {
        name: 'navigation.listSelection',
        modal: {
          controller: 'ModalWindowCtrl',
          templateUrl: 'templates/listSelection/modal-list-selection.html'
        },
        reloadOnSearch: false
      })
      .when('/diagram/settings', {
        name: 'navigation.settings',
        modal: {
          controller: 'SwcUserSettingsWindowCtrl',
          templateUrl: 'templates/settings/user-settings-modal.html'
        },
        reloadOnSearch: false
      })
      .otherwise({
        redirectTo: '/'
      });
  }
]);

mainApp.config(['$translateProvider', 'settingsServiceProvider', '$locationProvider',
    function($translateProvider, settingsServiceProvider, $locationProvider) {
        $translateProvider.useStaticFilesLoader({
            prefix: 'i18n/',
            suffix: '.json'
        });
        $locationProvider.hashPrefix('');
        var suppLang = [];
        angular.forEach(settingsServiceProvider.$get().supportedLanguages, function(lang) {
            suppLang.push(lang.code);
        });
        $translateProvider.registerAvailableLanguageKeys(suppLang);
        $translateProvider.determinePreferredLanguage();
        if ($translateProvider.preferredLanguage() === '' ||
            suppLang.indexOf($translateProvider.preferredLanguage()) === -1) {
            $translateProvider.preferredLanguage('en');
        }
        $translateProvider.useSanitizeValueStrategy(null);
    }
]);

mainApp.filter('objectCount', function() {
    return function(item) {
        if (item) {
            return Object.keys(item).length;
        } else {
            return 0;
        }
    };
});

mainApp.config(["$provide", function($provide) {
    // Use the `decorator` solution to substitute or attach behaviors to
    // original service instance; @see angular-mocks for more examples....

    $provide.decorator('$log', ["$delegate", function($delegate) {
        // Save the original $log.debug()
        var debugFn = $delegate.debug;

        $delegate.info = function() {
            var args = [].slice.call(arguments),
                now = moment().format('HH:mm:ss.SSS');

            // Prepend timestamp
            args[0] = now + " - " + args[0];

            // Call the original with the output prepended with formatted timestamp
            debugFn.apply(null, args);
        };

        return $delegate;
    }]);
}]);

// start the app after loading the settings.json
angular.injector(["ng"]).get("$q").all([fetchConfig(), fetchTemplates()]).then(bootstrapApp);

function fetchConfig() {
    return angular.injector(["ng"]).get("$http").get("settings.json").then(function(response) {
        mainApp.constant("config", response.data);
    });
}

function fetchTemplates() {
    return angular.injector(["ng"]).get("$http").get('templates/templates.json').then(response => {
        mainApp.constant("templatesMapping", response.data);
    });
}

function bootstrapApp() {
    angular.element(document).ready(function() {
        var injector = angular.bootstrap(document, ["jsClient"], {
            strictDi: true
        });
        // initilize parameter reader
        var startupService = injector.get('startupService');
        startupService.registerServices([
            'SetTimeseriesOfStatusService',
            'SetTimeParameterService',
            'SetInternalTimeseriesService',
            'SetConstellationService',
            'SetConstellationServiceHack',
            'SetLanguageService'
        ]);
        startupService.checkServices();
        // init mapService to have load stations directly
        injector.get('mapService');
    });
}
