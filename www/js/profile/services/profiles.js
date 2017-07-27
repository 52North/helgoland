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
                var timespan = {
                    start: profile.selectedTime,
                    end: profile.selectedTime
                };
                seriesApiInterface.getDatasetData(profile.id, profile.url, timespan).then((data) => {
                    _addData(data, profile);
                });
            };

            var saveProfile = (profile) => {
                statusService.status.profiles[profile.internalId] = profile;
            };

            var _addToProfile = (profile) => {
                profile.style = {
                    hidden: false,
                    selected: false,
                    color: colorService.getColor(profile.id)
                };
                profile.internalId = profile.url + 'datasets/' + profile.id;
                profile.permaProfiles = {};
                this.profiles[profile.internalId] = profile;
                notifyProfileObservers();
                saveProfile(profile);
                _loadData(profile);
            };

            this.addProfile = (profileId, url, time) => {
                seriesApiInterface.getDatasets(profileId, url)
                    .then(profile => {
                        profile.url = url;
                        profile.selectedTime = time;
                        _addToProfile(profile, this.profiles);
                    });
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
                if (statusService.status.profiles.hasOwnProperty(id)) {
                    delete statusService.status.profiles[id];
                }
                notifyProfileObservers();
            };

            this.clearAllProfiles = () => {
                for (var key in this.profiles) {
                    if (this.profiles.hasOwnProperty(key)) {
                        this.removeProfile(key);
                    }
                }
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

            // observer for profiles
            var observerCallbacksProfile = [];

            this.registerProfileObserver = (cb) => {
                observerCallbacksProfile.push(cb);
            };

            var notifyProfileObservers = () => {
                observerCallbacksProfile.forEach(cb => cb());
            };

            init();
        }
    ]);
