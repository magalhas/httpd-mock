"use strict";
var HttpdMock,
    express = require("express"),
    nconf = require("nconf");

exports = module.exports = HttpdMock = function () {
    if (!this instanceof HttpdMock) {
        return new HttpdMock();
    }
    this.webServer = express(),
    this.webServerListener,
    this.defaults = {
        serverRootPath: ".",
        servicesPrefix: "/api/",
        jsonMocksPath: "./mocks",
        output: true,
        webServices: {
            "get": {},
            "post": {}
        }
    };
    return this;
}

HttpdMock.prototype.createWebServices = function (webServices) {
    webServices = webServices || nconf.get("webServices");
    var webServicePath;
    if (webServices && webServices.get) {
        for (webServicePath in webServices.get) {
            webServicePath = nconf.get("servicesPrefix") + webServicePath;
             if (nconf.get("output")) {
                console.log("GET " + webServicePath);
            }
			this.geteInstance().get(webServicePath, function (req, res) {
                webServicePath = req.route.path.substr(nconf.get("servicesPrefix").length);
				res.sendfile(webServices.get[webServicePath], {root: nconf.get("jsonMocksPath")});
            });
		}
    }
    if (webServices && webServices.post) {
        for (webServicePath in webServices.post) {
            webServicePath = nconf.get("servicesPrefix") + webServicePath;
             if (nconf.get("output")) {
                console.log("POST " + webServicePath);
            }
            this.getInstance().post(webServicePath, function (req, res) {
                webServicePath = req.route.path.substr(nconf.get("servicesPrefix").length);
        		res.sendfile(webServices.post[webServicePath], {root: nconf.get("jsonMocksPath")});
			});
        }
	}
    return this;
};

HttpdMock.prototype.getInstance = function () {
    return this.webServer;
};

HttpdMock.prototype.getListener = function () {
    return this.webServerListener;
};

HttpdMock.prototype.getPort = function () {
    return nconf.get("serverPort");
};

HttpdMock.prototype.setConfigFile = function (file) {
    if (!file) {
        nconf.defaults(this.defaults);
        return this;
    }
    nconf
        .file(file)
        .defaults(this.defaults);
    return this;
};

HttpdMock.prototype.setOptions = function (options) {
    nconf.overrides(options);
    return this;
};

HttpdMock.prototype.setServerRootPath = function (serverRootPath) {
    serverRootPath = serverRootPath || nconf.get("serverRootPath");
    this.getInstance().use(express.static(serverRootPath));
    return this;
};

HttpdMock.prototype.start = function (port) {
    port = port || nconf.get("serverPort");
    this.webServerListener = this.getInstance().listen(port);
    nconf.overrides({"serverPort": this.webServerListener.address().port});
    if (nconf.get("output")) {
        console.log("Http mock server listening on port " + nconf.get("serverPort"));
    }
    return this;
};