angular.module('n52.core.profile')
        .factory('profilesService', ['$rootScope', 'interfaceService', 'statusService', 'colorService',
            function ($rootScope, interfaceService, statusService, colorService) {

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
                        hidden : false,
                        selected: false,
                        color: colorService.getColor(profile.id)
                    };
                    profile.permaProfiles = {};
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
                    return profiles[id].style.selected;
                }
                
                function toggleProfileSelection(id) {
                    profiles[id].style.selected = !profiles[id].style.selected;
                    $rootScope.$emit('profilesDataChanged', id);
                }
                
                function setColor(id, color) {
                    profiles[id].style.color = color;
                    $rootScope.$emit('profilesDataChanged', id);
                }
                
                function createPermaProfile(id) {
                    var profile = profiles[id];
                    profile.permaProfiles[profile.selectedTime] = {
                        color: colorService.getColor(profile.internalId + profile.selectedTime)
                    };
                    $rootScope.$emit('profilesDataChanged', id);
                }
                
                function removePermaProfile(id, timestamp) {
                    delete profiles[id].permaProfiles[timestamp];
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
                    setColor: setColor,
                    createPermaProfile: createPermaProfile,
                    removePermaProfile: removePermaProfile,
                    profiles: profiles
                };
            }]);