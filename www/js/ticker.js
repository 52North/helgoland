angular.module('n52.client.map')
    .controller('TickerCtrl', ['$scope', 'mqttService',
        function($scope, mqttService) {
            $scope.messages = [];

            printMessage = function(message) {
                $scope.messages.push(JSON.parse(message));
                $scope.$apply();
            };

            mqttService.registerMessageCb(printMessage);
        }
    ])
    .component('swcFifaTicker', {
        bindings: {
            messages: '<'
        },
        templateUrl: 'templates/ticker/timeline.html',
        controller: [
            function() {
                this.$onInit = function() {
                };

                this.$onChanges = function(changesObj) {
                  debugger;
                };
            }
        ]
    })
    .service('mqttService', [
        function() {

            var messageCb;

            var wsbroker = "192.168.2.46"; //mqtt websocket enabled broker
            var wsport = 9001; // port for above
            var topic = 'fifa2015';

            var client = new Paho.MQTT.Client(wsbroker, wsport, "myclientid_" + parseInt(Math.random() * 100, 10));
            client.onConnectionLost = function(responseObject) {
                console.log("connection lost: " + responseObject.errorMessage);
            };
            client.onMessageArrived = (message) => {
                debugger;
                console.log(message);
                messageCb(message.payloadString);
                // messages.push(message.destinationName + ' -- ' + message.payloadString);
            };
            var options = {
                timeout: 3000,
                onSuccess: function() {
                    console.log("mqtt connected");
                    // Connection succeeded; subscribe to our topic, you can add multile lines of these
                    client.subscribe(topic, {
                        qos: 1
                    });
                    //use the below if you want to publish to a topic on connect
                    // message = new Paho.MQTT.Message("Hello");
                    // message.destinationName = "fifa2015";
                    // client.send(message);
                },
                onFailure: function(message) {
                    console.log("Connection failed: " + message.errorMessage);
                }
            };

            client.connect(options);

            this.registerMessageCb = function(printMessage) {
                messageCb = printMessage;
            };

        }
    ]);
