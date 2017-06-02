angular.module('n52.core.profile')
    .service('profilesService', ['seriesApiInterface', 'statusService', 'colorService',
        function(seriesApiInterface, statusService, colorService) {

            this.profiles = {};
            this.profileData = {};

            var init = () => {
                if (statusService.status.profiles) {
                    for (var profile in statusService.status.profiles) {
                        if (statusService.status.profiles.hasOwnProperty(profile)) {
                            _addToProfile(statusService.status.profiles[profile]);
                        }
                    }
                } else {
                    statusService.status.profiles = {};
                }
            };

            var _addData = (data, profile) => {
                this.profileData[profile.internalId] = data.values;
                profile.loadingData = false;
            };

            var _loadData = (profile) => {
                profile.loadingData = true;
                seriesApiInterface.getDatasetData(profile.id, profile.apiUrl).then((data) => {
                    _addData(data, profile);
                });
            };

            var saveProfile = (profile) => {
                statusService.status.profiles[profile.internalId] = profile;
            };

            var deleteProfile = (id) => {
                if (statusService.status.profiles.hasOwnProperty(id)) {
                    delete statusService.status.profiles[id];
                }
            };

            var _addToProfile = (profile) => {
                profile.style = {
                    hidden: false,
                    selected: false,
                    color: colorService.getColor(profile.id)
                };
                profile.internalId = profile.apiUrl + 'datasets/' + profile.id;
                profile.permaProfiles = {};
                this.profiles[profile.internalId] = profile;
                saveProfile(profile);
                _loadData(profile);
            };

            this.addProfiles = (profile) => {
                _addToProfile(angular.copy(profile), this.profiles);
            };

            this.getData = (id) => {
                return this.profileData[id];
            };

            this.getProfile = (id) => {
                return this.profiles[id];
            };

            this.hasProfiles = () => {
                return Object.keys(this.profiles).length > 0;
            };

            this.removeProfile = (id) => {
                delete this.profiles[id];
                delete this.profileData[id];
                deleteProfile(id);
            };

            this.isProfileToggled = (id) => {
                return this.profiles[id].style.hidden;
            };

            this.toggleProfile = (id) => {
                this.profiles[id].style.hidden = !this.profiles[id].style.hidden;
            };

            this.isProfileSelectionToggled = (id) => {
                return this.profiles[id].style.selected;
            };

            this.toggleProfileSelection = (id) => {
                this.profiles[id].style.selected = !this.profiles[id].style.selected;
            };

            this.setColor = (id, color) => {
                this.profiles[id].style.color = color;
            };

            this.createPermaProfile = (id) => {
                var profile = this.profiles[id];
                profile.permaProfiles[profile.selectedTime] = {
                    color: colorService.getColor(profile.internalId + profile.selectedTime)
                };
            };

            this.removePermaProfile = (id, timestamp) => {
                delete this.profiles[id].permaProfiles[timestamp];
            };

            init();
        }
    ]);
