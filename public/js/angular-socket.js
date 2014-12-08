var module = angular.module("socket.io", [])

.provider("$socket", function $socketProvider() {
    var ioUrl = "", ioConfig = {};

    //
    function setOption(name, value, type) {
        if (typeof value != type) {
            throw new TypeError("'" + name + "' must be of type '" + type + "'.");
        }

        ioConfig[name] = value;
    }

    //
    this.setAutoConnect = function(value) {
        setOption("auto connect", value, "boolean");
    };

    //
    this.setConnectTimeout = function(value) {
        setOption("connect timeout", value, "number");
    };

    //
    this.setConnectionUrl = function(url) {
        if (typeof url == "string") {
            ioUrl = url;
        } else {
            throw new TypeError("url must be of type string");
        }
    };

    //
    this.setFlashPolicyPort = function(value) {
        setOption("flash policy port", value, "number");
    };

    //
    this.setForceNewConnection = function(value) {
        setOption("force new connection", value, "boolean");
    };

    //
    this.setMaxReconnectionAttempts = function(value) {
        setOption("max reconnection attempts", value, "number");
    };

    //
    this.setReconnect = function(value) {
        setOption("reconnect", value, "boolean");
    };

    //
    this.setReconnectionDelay = function(value) {
        setOption("reconnection delay", value, "number");
    };

    //
    this.setReconnectionLimit = function(value) {
        setOption("reconnection limit", value, "number");
    };

    //
    this.setResource = function(value) {
        setOption("resource", value, "string");
    };

    //
    this.setSyncDisconnectOnUnload = function(value) {
        setOption("sync disconnect on unload", value, "boolean");
    };

    //
    this.setTryMultipleTransports = function(value) {
        setOption("try multiple transports", value, "boolean");
    };

    //
    this.$get = function($rootScope) {
        var socket = io(ioUrl, ioConfig);

        return {
            emit: function emit(event, data, callback) {
                if (typeof callback == "function") {
                    socket.emit(event, data, function() {
                        var args = arguments;

                        $rootScope.$apply(function() {
                            callback.apply(socket, args);
                        });
                    });
                } else {
                    socket.emit(event, data);
                }
            },

            //
            off: function off(event, callback) {
                if (typeof callback == "function") {
                    socket.removeListener(event, callback);
                } else {
                    socket.removeAllListeners(event);
                }
            },

            //
            on: function on(event, callback) {
                socket.on(event, function() {
                    var args = arguments;
                    $rootScope.$apply(function() {
                        callback.apply(socket, args);
                    });
                });
            }
        }
    };
});
