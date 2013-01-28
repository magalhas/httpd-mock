"use strict";
var HttpdMock,
    _ = require("underscore"),
    express = require("express");

exports = module.exports = HttpdMock = function (options) {
    if (!this instanceof HttpdMock) {
        return new HttpdMock();
    }
    this.webServer = express();
    this.options = {};
    this.defaults = require("./httpd-mock.defaults.json");
    options && this.setOptions(options);
    return this;
}

HttpdMock.prototype.createWebServices = function (webServices) {
    if (this.areWebServicesCreated) {
        return this;
    }
    webServices = webServices || this.options.webServices;
    var webServicePath;
    if (webServices && webServices.get) {
        for (webServicePath in webServices.get) {
            webServicePath = this.options.servicesPrefix + webServicePath;
             if (this.options.output) {
                console.log("GET " + webServicePath);
            }
			this.getInstance().get(webServicePath, function (req, res) {
                webServicePath = req.route.path.substr(this.options.servicesPrefix.length);
				res.sendfile(webServices.get[webServicePath], {root: this.options.jsonMocksPath});
            });
		}
    }
    if (webServices && webServices.post) {
        for (webServicePath in webServices.post) {
            webServicePath = this.options.servicesPrefix + webServicePath;
             if (this.options.output) {
                console.log("POST " + webServicePath);
            }
            this.getInstance().post(webServicePath, function (req, res) {
                webServicePath = req.route.path.substr(this.options.servicesPrefix.length);
                res.sendfile(webServices.post[webServicePath], {root: this.options.jsonMocksPath});
			});
        }
	}
    this.areWebServicesCreated = true;
    return this;
};

HttpdMock.prototype.getInstance = function () {
    return this.webServer;
};

HttpdMock.prototype.getListener = function () {
    return this.webServerListener;
};

HttpdMock.prototype.getPort = function () {
    return this.options.serverPort;
};

HttpdMock.prototype.setConfigFile = function (file) {
    if (!file) {
        return this.setOptions();
    }
    _.defaults(this.options, require(file), this.defaults);
    return this;
};

HttpdMock.prototype.setOptions = function (options) {
    !this.areDefaultsApplied ? (this.areDefaultsApplied = true) :
        _.defaults(this.options, this.defaults);
    options && (this.options = _.defaults(options, this.options));
    this.options.output === "false" && (this.options.output = false);
    return this;
};

HttpdMock.prototype.setServerRootPath = function (serverRootPath) {
    serverRootPath = serverRootPath || this.options.serverRootPath;
    !this.isServerRootPathDefined ?
        this.getInstance().use(express.static(serverRootPath)) :
        this.isServerRoothPathDefined = true;
    return this;
};

HttpdMock.prototype.start = function (port) {
    port = port || this.options.serverPort;
    this.setServerRootPath().createWebServices();
    this.webServerListener = this.getInstance().listen(port);
    this.options.serverPort = this.webServerListener.address().port;
    this.options.output &&
        console.log("Http mock server listening on port " + this.options.serverPort);
    return this;
};