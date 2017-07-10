angular.module('n52.core.profile')
    .component('swcProfileChartView', {
        template: require('../../../templates/profile/profile-chart-view.html'),
        controller: ['profileChartPermalinkSrvc',
            function(profileChartPermalinkSrvc) {
                this.$onInit = () => {
                    profileChartPermalinkSrvc.validatePermalink();
                };
            }
        ]
    })
    .component('swcProfileChartPermalink', {
        template: require('../../../templates/menu/permalink.html'),
        controller: ['profileChartPermalinkSrvc', 'permalinkOpener',
            function(profileChartPermalinkSrvc, permalinkOpener) {
                this.permalink = () => {
                    permalinkOpener.openPermalink(profileChartPermalinkSrvc.createPermalink());
                };
            }
        ]
    })
    .service('profileChartPermalinkSrvc', ['profilesService', '$location',
        function(profilesService, $location) {
            var profilesParam = 'profiles';
            var paramSeperator = '|';
            var paramBlockSeperator = '!!';

            this.createPermalink = () => {
                var parameters = [];
                for (var id in profilesService.profiles) {
                    if (profilesService.profiles.hasOwnProperty(id)) {
                        var profile = profilesService.getProfile(id);
                        parameters.push(profile.apiUrl + paramSeperator + profile.id);
                    }
                }
                if (parameters.length > 0) {
                    return $location.absUrl() + '?' + profilesParam + '=' + encodeURIComponent(parameters.join(paramBlockSeperator));
                } else {
                    return $location.absUrl();
                }
            };

            this.validatePermalink = () => {
                if ($location.search()[profilesParam]) {
                    profilesService.clearAllProfiles();
                    var parameters = $location.search()[profilesParam].split(paramBlockSeperator);
                    parameters.forEach(entry => {
                        var profileParam = entry.split(paramSeperator);
                        if (profileParam.length == 2) {
                            var providerUrl = profileParam[0];
                            var datasetId = profileParam[1];
                            profilesService.addProfile(datasetId, providerUrl);
                        }
                    });
                }
            };
        }
    ]);
