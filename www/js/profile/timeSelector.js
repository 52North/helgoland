angular.module('n52.core.profile')
        .directive('swcProfileTimeSelector', function () {
            return {
                restrict: 'E',
                templateUrl: 'templates/profile/profile-time-selector.html',
                scope: {
                    series: '='
                },
                controller: ['$scope', 'timeSliderService', '$rootScope',
                    function ($scope, timeSliderService, $rootScope) {
                        initValues = function () {
                            var steps = timeSliderService.getTimeSteps($scope.series.internalId);
                            $scope.options = {
                                stepsArray: steps,
                                keyboardSupport: false,
                                onEnd: setSelectedTime
                            };
                            $scope.value = timeSliderService.getIdxForTimestamp($scope.series.internalId, $scope.series.selectedTime) || 0;
                            setSelectedTime();
                        };

                        setSelectedTime = function () {
                            $scope.series.selectedTime = timeSliderService.getTimestamp($scope.series.internalId, $scope.value);
                            $rootScope.$emit('profilesTimestampChanged', $scope.series.internalId);
                        };

                        $rootScope.$on('profilesDataChanged', function () {
                            initValues();
                        });

                        initValues();
                    }]
            };
        })
        .service('timeSliderService', ['profilesService', 'settingsService',
            function (profilesService, settingsService) {
                this.getTimeSteps = function (internalId) {
                    var steps = [], data = profilesService.getData(internalId);
                    angular.forEach(data, function (entry) {
                        steps.push(moment(entry.timestamp).format(settingsService.dateformat));
                    });
                    return steps;
                };
                this.getTimestamp = function (internalId, idx) {
                    var data = profilesService.getData(internalId);
                    if (data && data.length >= idx) {
                        return data[idx].timestamp;
                    }
                };
                this.getIdxForTimestamp = function (internalId, timestamp) {
                    var idx;
                    if (timestamp) {
                        angular.forEach(profilesService.getData(internalId), function (entry, i) {
                            if (entry.timestamp === timestamp) {
                                idx = i;
                            }
                        });
                    }
                    return idx;
                };
            }]);