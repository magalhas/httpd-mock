var express = require('express'),
    nconf = require('nconf');

exports = module.exports = function () {
    var webServer = express(),
        webServerListener,
        defaults = {
            serverRootPath: '.',
            servicesPrefix: '/webservice/',
            jsonMocksPath: './mocks',
            output: false,
            webServices: {
                'get': {},
                'post': {}
            }
        };
    return {
        createWebServices: function (webServices) {
            webServices = webServices || nconf.get('webServices');
            var webServicePath;
            if (webServices && webServices.get) {
            	for (webServicePath in webServices.get) {
                    webServicePath = nconf.get('servicesPrefix') + webServicePath;
                     if (nconf.get('output')) {
                        console.log('GET ' + webServicePath);
                    }
        			webServer.get(webServicePath, function (req, res) {
                        webServicePath = req.route.path.substr(nconf.get('servicesPrefix').length);
        				res.sendfile(webServices.get[webServicePath], {root: nconf.get('jsonMocksPath')});
        			});
        		}
            }
            if (webServices && webServices.post) {
                for (webServicePath in webServices.post) {
                    webServicePath = nconf.get('servicesPrefix') + webServicePath;
                     if (nconf.get('output')) {
                        console.log('POST ' + webServicePath);
                    }
                    webServer.post(webServicePath, function (req, res) {
                        webServicePath = req.route.path.substr(nconf.get('servicesPrefix').length);
                		res.sendfile(webServices.post[webServicePath], {root: nconf.get('jsonMocksPath')});
        			});
                }
        	}
            return this;
        },
        getInstance: function () {
            return webServer;
        },
        getListener: function () {
            return webServerListener;
        },
        getPort: function () {
            return nconf.get('serverPort');
        },
        setConfigFile: function (file) {
            if (!file) {
                nconf.defaults(defaults);
                return this;
            }
            nconf
                .file(file)
                .defaults(defaults);
            return this;
        },
        setOptions: function (options) {
            nconf.overrides(options);
            return this;
        },
        setServerRootPath: function (serverRootPath) {
            serverRootPath = serverRootPath || nconf.get('serverRootPath');
            webServer.use(express.static(serverRootPath));
            return this;
        },
        start: function (port) {
            port = port || nconf.get('serverPort');
            webServerListener = webServer.listen(port);
            nconf.overrides({'serverPort': webServerListener.address().port});
            if (nconf.get('output')) {
                console.log('Http mock server listening on port ' + nconf.get('serverPort'));
            }
            return this;
        }
    };
};