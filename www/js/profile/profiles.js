angular.module('n52.core.profile')
        .factory('profilesService', ['$rootScope', 'interfaceService', 'statusService', 'timeService', 'styleService', 'settingsService',
            function ($rootScope, interfaceService, statusService, timeService, styleService, settingsService) {

                var profiles = {};
                var profileData = {};

                function _addData(data, profile) {
                    profileData[profile.internalId] = data[profile.id].values;
                    $rootScope.$emit('profilesDataChanged', profile.internalId);
                    profile.loadingData = false;
                }

                function _loadData(profile) {
                    profile.loadingData = true;
                    interfaceService.getTsData(profile.id, profile.apiUrl).then(function (data) {
                        _addData(data, profile);
                    });
                }

                function _addProfile(profile) {
//                    styleService.createStylesInTs(ts);
                    profiles[profile.internalId] = profile;
                    statusService.addTimeseries(profile);
                    _loadData(profile);
                }

                function addProfiles(profile) {
                    _addProfile(angular.copy(profile));
                }
                
                function getData(internalId) {
                    return profileData[internalId];
                }
                
                function getAllProfiles() {
                    return profiles;
                }
                
                function getProfile(internalId) {
                    return profiles[internalId];
                }
                
                function removeProfile(internalId) {
//                    styleService.deleteStyle(timeseries[internalId]);
                    delete profiles[internalId];
                    delete profileData[internalId];
                    statusService.removeTimeseries(internalId);
                    $rootScope.$emit('profilesDataChanged', internalId);
                }

                return {
                    addProfiles: addProfiles,
                    getAllProfiles: getAllProfiles,
                    getProfile: getProfile,
                    getData: getData,
                    removeProfile: removeProfile,
                    profiles: profiles
                };
            }]);