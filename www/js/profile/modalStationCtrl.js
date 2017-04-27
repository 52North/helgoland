angular.module('n52.core.profile')
    .service('profilePresentDataset', ['profilesService', '$location',
        function(profilesService, $location) {
            this.presentDataset = function(dataset, providerUrl) {
                debugger;
                dataset.apiUrl = providerUrl;
                profilesService.addProfiles(dataset);
                $location.url('/profiles');
            };
        }
    ]);
