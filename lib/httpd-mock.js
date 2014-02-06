'use strict';
var HttpdMock,
  _ = require('underscore'),
  express = require('express');

exports = module.exports = HttpdMock = function (options) {
  if (!this instanceof HttpdMock) {
    return new HttpdMock();
  }
  this.webServer = express();
  this.defaults = require('./httpd-mock.defaults');
  this.setOptions(options);
  this.namespace = {};
  return this;
};

HttpdMock.prototype.close = function () {
  this.getListener().close();
  return this;
};

HttpdMock.prototype.createWebServices = function (webServices) {
  var webServicePath;
  webServices = webServices || this.options.webServices;
  if (webServices && webServices.get) {
    for (webServicePath in webServices.get) {
      this.prepareNamespace(webServices.get[webServicePath]);
      webServicePath = this.options.servicesPrefix + webServicePath;
      if (this.options.output) {
        console.log('GET ' + webServicePath);
      }
      this.getInstance().get(webServicePath, function (req, res) {
        webServicePath = req.route.path.substr(this.options.servicesPrefix.length);
        var target = webServices.get[webServicePath];
        // If namespace mode
        if (target.indexOf('.json') === -1) {
          var id = req.params.id;
          if (id) res.send(_.findWhere(this.namespace[target], {_id: id}));
          else res.send(this.namespace[target]);
        }
        // Else it's file mode
        else {
          res.sendfile(target, {root: this.options.jsonMocksPath});
        }
      }.bind(this));
    }
  }
  if (webServices && webServices.post) {
    for (webServicePath in webServices.post) {
      this.prepareNamespace(webServices.post[webServicePath]);
      webServicePath = this.options.servicesPrefix + webServicePath;
       if (this.options.output) {
        console.log('POST ' + webServicePath);
      }
      this.getInstance().post(webServicePath, function (req, res) {
        webServicePath = req.route.path.substr(this.options.servicesPrefix.length);
        var target = webServices.post[webServicePath];
        // If namespace mode
        if (target.indexOf('.json') === -1) {
          var id = req.params.id;
          var data = req.body;
          var existing;
          if (!data._id) data._id = Date.now();
          if (id) existing = _.findWhere(this.namespace[target], {_id: id});
          if (existing) {
            for (var key in existing) delete existing[key];
            _.extend(existing, data);
          } else
            this.namespace[target].push(data);
          res.send(data);
        }
        // Else it's file mode
        else {
          res.sendfile(target, {root: this.options.jsonMocksPath});
        }
      }.bind(this));
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
  return this.options.serverPort;
};

HttpdMock.prototype.prepareNamespace = function (key) {
  if (key.indexOf('.json') === -1 && !this.namespace[key]) {
    var defaults = this.options.defaults[key];
    if (defaults instanceof Array) this.namespace[key] = defaults.concat();
    else if (typeof defaults === 'string') this.namespace[key] = require(defaults).concat();
    else this.namespace[key] = [];
  }
};

HttpdMock.prototype.setConfigFile = function (file) {
  if (file) _.defaults(this.options || {}, require(file), this.defaults || {});
  else this.setOptions();
  return this;
};

HttpdMock.prototype.setOptions = function (options) {
  this.options = _.defaults(options || {}, this.options || {}, this.defaults || {});
  return this;
};

HttpdMock.prototype.setServerRootPath = function (serverRootPath) {
  serverRootPath = serverRootPath || this.options.serverRootPath;
  this.getInstance().use(express.static(serverRootPath));
  return this;
};

HttpdMock.prototype.start = function (port) {
  port = port || this.options.serverPort;
  this.getInstance().use(express.bodyParser());
  this.setServerRootPath().createWebServices();
  this.webServerListener = this.getInstance().listen(port);
  this.options.serverPort = this.getListener().address().port;
  if (this.options.output) console.log('Http mock server listening on port ' + this.options.serverPort);
  return this;
};