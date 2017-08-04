require('n52-sensorweb-client-core/src/js/permalink/simple-permalink-button/component');
require('n52-sensorweb-client-core/src/js/permalink/service/permalink-service');

angular.module('n52.core.profile')
    .component('swcProfileCombiView', {
        template: require('./combi-view.component.html'),
        controller: ['profileCombiPermalinkSrvc', 'swcProfileCombiViewStateSrvc', '$scope',
            function(profileCombiPermalinkSrvc, swcProfileCombiViewStateSrvc, $scope) {

                this.$onInit = () => {
                    profileCombiPermalinkSrvc.validatePermalink()
                        .then(() => {
                            swcProfileCombiViewStateSrvc.profile.style = {
                                color: 'red'
                            };
                            this.header = swcProfileCombiViewStateSrvc.profile.label;
                            this.profiles = {
                                'combi': swcProfileCombiViewStateSrvc.profile
                            };
                            this.profileData = {
                                'combi': [{
                                    value: swcProfileCombiViewStateSrvc.data.value,
                                    verticalUnit: swcProfileCombiViewStateSrvc.data.verticalUnit
                                }]
                            };
                            this.geometry = swcProfileCombiViewStateSrvc.data.geometry;
                        });
                };

                this.createPermalink = () => {
                    return profileCombiPermalinkSrvc.createPermalink();
                };

                this.onHighlight = (highlight) => {
                    this.highlightGeometry = {
                        "type": "Point",
                        "coordinates": swcProfileCombiViewStateSrvc.data.geometry.coordinates[highlight.index]
                    };
                    $scope.$apply();
                };
            }
        ]
    })
    .service('profileCombiPermalinkSrvc', ['$location', 'seriesApiInterface', 'swcProfileCombiViewStateSrvc', '$q', 'permalinkService',
        function($location, seriesApiInterface, swcProfileCombiViewStateSrvc, $q, permalinkService) {
            var providerUrlParam = 'url';
            var profileIdParam = 'id';
            var timestampParam = 'time';
            this.createPermalink = () => {
                var parameter = '';
                if (swcProfileCombiViewStateSrvc.profile && swcProfileCombiViewStateSrvc.data) {
                    parameter += providerUrlParam + '=' + swcProfileCombiViewStateSrvc.profile.url;
                    parameter += '&' + profileIdParam + '=' + swcProfileCombiViewStateSrvc.profile.id;
                    parameter += '&' + timestampParam + '=' + swcProfileCombiViewStateSrvc.data.timestamp;
                }
                if (parameter) {
                    return permalinkService.createBaseUrl() + '?' + parameter;
                } else {
                    return permalinkService.createBaseUrl();
                }
            };

            this.validatePermalink = () => {
                return $q((resolve) => {
                    if ($location.search()[providerUrlParam] && $location.search()[profileIdParam] && $location.search()[timestampParam]) {
                        var url = $location.search()[providerUrlParam];
                        var id = $location.search()[profileIdParam];
                        var timestamp = $location.search()[timestampParam];
                        seriesApiInterface.getDatasets(id, url)
                            .then(profile => {
                                profile.url = url;
                                swcProfileCombiViewStateSrvc.profile = profile;
                                var timespan = {
                                    start: parseInt(timestamp),
                                    end: parseInt(timestamp)
                                };
                                seriesApiInterface.getDatasetData(id, url, timespan)
                                    .then(data => {
                                        swcProfileCombiViewStateSrvc.data = data.values[0];
                                        resolve();
                                    });
                            });
                    } else {
                        resolve();
                    }
                });
            };
        }
    ])
    .service('swcProfileCombiViewStateSrvc', [
        function() {}
    ]);
