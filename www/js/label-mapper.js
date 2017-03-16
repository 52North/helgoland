angular.module('n52.core.legend')
    .component('swcLabelMapper', {
        bindings: {
            label: '<'
        },
        templateUrl: 'n52.core.legend.label-mapper',
        controller: ['$http', '$q',
            function($http, $q) {
                var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
                this.$onInit = function() {
                    var urls = findUrls(this.label);
                    if (urls.length > 0) {
                        var request = [];
                        urls.forEach((url) => {
                            request.push($http.get(proxyUrl + url, {
                                cache: true
                            }).then((response) => {
                                var xml = jQuery.parseXML(response.data);
                                this.label = this.label.replace(url, $(xml).find('prefLabel').text());
                            }, (error) => {}));
                        });
                        $q.all(request).then(() => {
                            this.determinedLabel = this.label;
                        });
                    } else {
                        this.determinedLabel = this.label;
                    }
                };

                var findUrls = function(text) {
                    var source = (text || '').toString();
                    var urlArray = [];
                    var url;
                    var matchArray;
                    // Regular expression to find FTP, HTTP(S) and email URLs.
                    var regexToken = /(((ftp|https?):\/\/)[\-\w@:%_\+.~#?&\/\/=]+)/g;
                    // Iterate through any URLs in the text.
                    while ((matchArray = regexToken.exec(source)) !== null) {
                        var token = matchArray[0];
                        urlArray.push(token);
                    }
                    return urlArray;
                };
            }
        ]
    })
    // .service('labelMapperSrvc', ['$q',
    //     function($q) {
    //         this.getMappedLabel(label) {
    //             return $q(function(resolve, reject) {
    //
    //                 if (serviceRootUrlToVersionMap[apiUrl]) {
    //
    //                     resolve(serviceRootUrlToVersionMap[apiUrl]);
    //
    //                 } else {
    //
    //                     detectApiVersion(apiUrl).then(
    //
    //                         function(apiVersion) {
    //                             resolve(apiVersion);
    //                         });
    //                 }
    //             });
    //         }
    //     }
    // ]);
