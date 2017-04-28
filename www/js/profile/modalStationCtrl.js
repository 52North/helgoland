angular.module('n52.core.profile')
    .service('profilePresentDataset', ['profilesService', '$location',
        function(profilesService, $location) {
            this.presentDataset = (dataset, providerUrl) => {
                dataset.apiUrl = providerUrl;
                profilesService.addProfiles(dataset);
                $location.url('/profiles');
            };
        }
    ]);
