angular.module('n52.core.metadata')
    .component('swcEditProcedure', {
        bindings: {
            timeseries: "<"
        },
        templateUrl: "templates/metadata/edit-procedure.html",
        controller: 'SwcEditProcedureCtrl'
    })
    .controller('SwcEditProcedureCtrl', ['sosUrlSrv', '$window', 'settingsService',
        function(sosUrlSrv, $window, settingsService) {

            this.$onInit = function () {
                this.editorUrl = getEditorUrl();
                this.sosUrl = getSosUrl(this.timeseries);
                this.isEnabled = !!this.editorUrl && !!this.sosUrl;
            }

            function getSosUrl(series) {
                var apiUrl = series.apiUrl;
                var serviceID = series.parameters.service.id;
                if (settingsService.editor &&
                    settingsService.editor.editableServices &&
                    settingsService.editor.editableServices[apiUrl] &&
                    settingsService.editor.editableServices[apiUrl][serviceID]
                ) {
                    return settingsService.editor.editableServices[apiUrl][serviceID];
                }
                // TODO request laster by checking the service
            }

            function getEditorUrl() {
                if (settingsService.editor && settingsService.editor.url)
                    return settingsService.editor.url;
            }

            this.openEditorWithProcedure = function() {
                var id = this.timeseries.parameters.procedure.domainId ? this.timeseries.parameters.procedure.domainId : this.timeseries.parameters.procedure.label;
                var path = '?' +
                    'procedureId=' + encodeURIComponent(id) + '&' +
                    'sosUrl=' + encodeURIComponent(this.sosUrl);
                $window.open(this.editorUrl + path);
            };
        }
    ]);
