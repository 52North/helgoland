var mainApp = angular.module('jsClient', [
    'ngRoute',
    'n52.core.map',
    'n52.core.menu',
    'n52.client.menu',
    'n52.core.userSettings',
    'n52.core.legend',
    'n52.core.diagram',
    'n52.core.overviewDiagram',
    'n52.core.dataLoading',
    'n52.core.listSelection',
    'n52.core.startup',
    'n52.core.favoriteUi',
    'n52.core.alert',
    'n52.core.permalinkEval',
    'n52.core.translateSelector']);

mainApp.config(['$routeProvider', 'MenuProvider', function ($routeProvider, MenuProvider) {
        $routeProvider
                .when('/', {templateUrl: 'templates/views/diagramView.html', reloadOnSearch: false})
                .when('/diagram', {templateUrl: 'templates/views/diagramView.html', reloadOnSearch: false})
                .when('/map', {templateUrl: 'templates/views/mapView.html', reloadOnSearch: false})
                .when('/favorite', {templateUrl: 'templates/views/favoriteView.html', reloadOnSearch: false})
                .otherwise({redirectTo: '/'});
        MenuProvider.add({
            url: '/map',
            title: 'main.mapView',
            target: '#map',
            icon: 'glyphicon-globe'
        });
        MenuProvider.add({
            url: '/diagram',
            title: 'main.chartView',
            target: '#diagram',
            icon: 'glyphicon-stats'
        });
        MenuProvider.add({
            title: 'main.settings',
            icon: 'glyphicon-cog',
            controller: 'UserSettingsCtrl',
            click: 'open()'
        });
        MenuProvider.add({
            url: '/favorite',
            title: 'main.favoriteView',
            target: '#favorite',
            icon: 'glyphicon-star'
        });
    }]);

mainApp.config(['$translateProvider', 'settingsServiceProvider', function ($translateProvider, settingsServiceProvider) {
        $translateProvider.useStaticFilesLoader({
            prefix: 'i18n/',
            suffix: '.json'
        });
        var suppLang = [];
        angular.forEach(settingsServiceProvider.$get().supportedLanguages, function(lang) {
            suppLang.push(lang.code);
        });
        $translateProvider.registerAvailableLanguageKeys(suppLang);
        $translateProvider.determinePreferredLanguage();
    }]);

mainApp.filter('objectCount', function () {
    return function (item) {
        if (item) {
            return Object.keys(item).length;
        } else {
            return 0;
        }
    };
});

mainApp.config(["$provide", function ($provide)
    {
        // Use the `decorator` solution to substitute or attach behaviors to
        // original service instance; @see angular-mocks for more examples....

        $provide.decorator('$log', ["$delegate", function ($delegate)
            {
                // Save the original $log.debug()
                var debugFn = $delegate.debug;

                $delegate.info = function ( )
                {
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
fetchData().then(bootstrapApp);

function fetchData() {
    var initInjector = angular.injector(["ng"]);
    var $http = initInjector.get("$http");
    return $http.get("settings.json").then(function (response) {
        mainApp.constant("config", response.data);
    });
}

function bootstrapApp() {
    angular.element(document).ready(function () {
        var injector = angular.bootstrap(document, ["jsClient"],{strictDi:true});
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
    });
}
