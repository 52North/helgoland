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
                    profile.style = {
                        hidden : false
                    };
                    profiles[profile.internalId] = profile;
                    statusService.addTimeseries(profile);
                    _loadData(profile);
                }

                function addProfiles(profile) {
                    _addProfile(angular.copy(profile));
                }

                function getData(id) {
                    return profileData[id];
                }

                function getAllProfiles() {
                    return profiles;
                }

                function getProfile(id) {
                    return profiles[id];
                }

                function removeProfile(id) {
                    delete profiles[id];
                    delete profileData[id];
                    statusService.removeTimeseries(id);
                    $rootScope.$emit('profilesDataChanged', id);
                }

                function isProfileToggled(id) {
                    return profiles[id].style.hidden;
                }
                
                function toggleProfile(id) {
                    profiles[id].style.hidden = !profiles[id].style.hidden;
                    $rootScope.$emit('profilesDataChanged', id);
                }
                
                function isProfileSelectionToggled(id) {
                    return profiles[id].style.selection;
                }
                
                function toggleProfileSelection(id) {
                    profiles[id].style.selection = !profiles[id].style.selection;
                    $rootScope.$emit('profilesDataChanged', id);
                }

                return {
                    addProfiles: addProfiles,
                    getAllProfiles: getAllProfiles,
                    getProfile: getProfile,
                    getData: getData,
                    removeProfile: removeProfile,
                    isProfileToggled: isProfileToggled,
                    toggleProfile: toggleProfile,
                    isProfileSelectionToggled: isProfileSelectionToggled,
                    toggleProfileSelection: toggleProfileSelection,
                    profiles: profiles
                };
            }]);