angular.module('n52.core.legend')
    .component('swcLabelMapper', {
        bindings: {
            label: '<'
        },
        templateUrl: 'n52.core.legend.label-mapper',
        controller: ['$http', '$q', 'labelMapperSrvc',
            function($http, $q, labelMapperSrvc) {
                this.$onInit = function() {
                    labelMapperSrvc.getMappedLabel(this.label).then((label) => {
                        this.determinedLabel = label;
                    });
                };
            }
        ]
    })
    .service('labelMapperSrvc', ['$q', '$http', 'settingsService',
        function($q, $http, settingsService) {

            var findUrls = function(text) {
                var source = (text || '').toString();
                var urlArray = [];
                var url;
                var matchArray;
                var regexToken = /(((ftp|https?):\/\/)[\-\w@:%_\+.~#?&\/\/=]+)/g;
                while ((matchArray = regexToken.exec(source)) !== null) {
                    var token = matchArray[0];
                    urlArray.push(token);
                }
                return urlArray;
            };

            this.getMappedLabel = function(label) {
                return $q(function(resolve, reject) {
                    var urls = findUrls(label);
                    if (urls.length > 0) {
                        var request = [];
                        urls.forEach((url) => {
                            request.push($http.get(settingsService.proxyUrl + url, {
                                cache: true
                            }).then((response) => {
                                var xml = jQuery.parseXML(response.data);
                                label = label.replace(url, $(xml).find('prefLabel').text());
                            }, (error) => {}));
                        });
                        $q.all(request).then(() => {
                            resolve(label);
                        });
                    } else {
                        resolve(label);
                    }
                });
            };
        }
    ]);
